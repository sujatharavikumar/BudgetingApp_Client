angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('BudgetsCtrl', function($scope, $http) {
  $scope.budgets = [
    { title: 'Housing', id: 'housing' },
    { title: 'Electricity', id: 'electricity' },
    { title: 'Water', id: 'water' },
    { title: 'Phone', id: 'phone'},
    { title: 'Heating', id: 'heating' },
    { title: 'Groceries', id: 'groceries' },
    { title: 'Restaurants', id: 'restaurants' },
    { title: 'Clothing', id: 'clothing' },
    { title: 'Beauty', id: 'beauty' },
    { title: 'Atomobile', id: 'automobile' },
    { title: 'Entertainment', id: 'entertainment' }
  ];

  $http({
    method: 'GET',
    url:'http://localhost:8080/allbudgets'
  })
  .then( function (response){
      $scope.value = response.data[0];
  })
})

.controller('BudgetCtrl', function($scope, $stateParams, $http) {
  $scope.id = $stateParams.budgetId;

  $scope.updateBudget = function (id) {

    var type = id.toLowerCase();
    var newBudget = document.getElementById("newBudget");

    var payment = {
      id: 1,
      amount: newBudget.value
    }

    $http({
      method: 'PUT',
      url:'http://localhost:8080/update' + type + 'budget',
      data: payment
    })
    .then( function (response){
      newBudget.value = "";
        console.log(response.data);
    })
  }
})

.controller('PaymentsCtrl', function($scope, $stateParams, $http, $ionicPopup) {

  $scope.bills = [
    "Phone",
    "Housing",
    "Electricity",
    "Heating",
    "Water",
    "Automobile"
  ];

  $scope.purchases = [
    "Groceries",
    "Restaurants",
    "Clothing",
    "Beauty",
    "Entertainment"
  ];

  $scope.id = $stateParams.budgetId;

  var overspentBudgetPopup = function () {
    var alertPopup = $ionicPopup.alert({
      title: 'Overspent Budget',
      templateUrl: 'templates/popup.html'
    });
  }

  $scope.submitPayment = function (purchaseForm, purchaseType) {

    var amount;
    var purchase = document.getElementById(purchaseForm);
    var type = document.getElementById(purchaseType).value.toLowerCase();

    if (purchase.value !== undefined) {
      amount = purchase.value;
    } else {
      amount = 0;
    }

    var payment = {
      "id": 1,
      "amount": amount
    }

    $http ({
      method: 'PUT',
      url: 'http://localhost:8080/make' +  type + 'payment',
      data: payment
    })
    .then ( function (response) {
      if (response.data[0] < response.data[1]) {
        overspentBudgetPopup();
      }
      purchase.value = "";
    })
  };
});
