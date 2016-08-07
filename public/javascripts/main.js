var username = null;

angular.module("main", [ "ui.router" ])
  .config(function($stateProvider, $urlRouterProvider) {
    // default route
    $urlRouterProvider.otherwise(function(injector) {
      injector.get("$state").go("login");
    });

    $stateProvider.state("login", {
      url: "/login",
      templateUrl: "/templates/login",
      data: {
        requiresLogin: false
      },
      controller: function($scope, $state) {
        $scope.username = "";
        $scope.login = function() {
          if ($scope.username) {
            username = $scope.username;
            $state.go("list");
          }
        }
      }
    });

    $stateProvider.state("list", {
      url: "/list",
      templateUrl: "/templates/list",
      data: {
        requiresLogin: true
      },
      resolve: {
        fruits: function($http) {
          return $http.get("/fruits");
        }
      },
      controller: function($scope, $http, fruits) {
        $scope.fruits = fruits.data;

        function update() {
          $http.get("/fruits").then(function(response) {
            $scope.fruits = response.data;
          });
        }

        $scope.add = function() {
          $http.post("/fruits/" + $scope.name).then(update);
          $scope.name = "";
        };

        $scope.delete = function(fruit) {
          $http.delete("/fruits/" + fruit.name).then(update);
        };
      }
    });

  })
  .run(function($rootScope, $state) {

    // redirect non-logged in users to login page
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams) {
      if (!username && toState.data.requiresLogin) {
        event.preventDefault();
        $state.go("login");
      } else if (username && toState.name == "login") {
        event.preventDefault();
        $state.go("list");
      } else {
        return;
      }
    });

  });


angular.bootstrap(document, [ "main" ]);
