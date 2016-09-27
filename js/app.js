var bookingApp = angular.module('bookingApplication', []);

// MAIN CONTROLLER
bookingApp.controller('mainController', ['$scope', function ($scope) {}]);

// TICKETS CONTROLLER
bookingApp.controller('ticketsController', ['$scope', '$http', function ($scope, $http) {

  // Variables
  $scope.ticketsInProcess = [];

  // FN -> create and return array of seats objects
  // Param -> (number, number, number)
  $scope.createSeats = function (row, number, price) {
    var rowArray = [];
    var newSeat = function (row, number, price) {
      return {
        row: row,
        number: number,
        price: price,
        inProcess: false,
        booked: false
      };
    };
    for (var i = 1; i <= number; i++) {
      var seat = newSeat(row, i, price);
      rowArray.push(seat);
    }
    return rowArray;
  }

  // Get array rows from remote json if it will be empty it will be seted default values
  $http.get('https://api.myjson.com/bins/51klg').success(function (response) {
    if (response.length > 0) {
      $scope.hallRows = response;
      //Remove preloader
      angular.element(document.querySelector('.loader')).remove();
    } else {
      // ARR -> array with row objects and with array of seats objects inside
      $scope.hallRows = [
        {
          number: 1,
          seats: $scope.createSeats(1, 14, 130)
        },
        {
          number: 2,
          seats: $scope.createSeats(2, 14, 110)
        },
        {
          number: 3,
          seats: $scope.createSeats(3, 14, 90)
        },
        {
          number: 4,
          seats: $scope.createSeats(4, 14, 80)
        }
      ];
      //Remove preloader
      angular.element(document.querySelector('.loader')).remove();
    }
  });

  // FN -> Add tickets to process array
  $scope.processTicket = function (rowNumber, number) {
    angular.forEach($scope.hallRows, function (row, key) {
      if (rowNumber === row.number) {
        angular.forEach(row.seats, function (seat, key) {
          if (number === seat.number) {
            if (seat.inProcess && !seat.booked) {
              $scope.ticketsInProcess.splice($scope.ticketsInProcess.indexOf(seat), 1);
            } else if (!seat.inProcess && !seat.booked) {
              $scope.ticketsInProcess.push(seat);
            }
            seat.inProcess = !seat.inProcess;
          }
        });
      }
    });
  };

  // FN -> calculate sum of tickets price from array
  $scope.sumTicketsPrice = function (ticketArray) {
    var tempSum = 0;
    angular.forEach(ticketArray, function (ticket, key) {
      tempSum += ticket.price;
    });
    return tempSum;
  };

  // FN -> run 3 loops and change value of booking seats
  $scope.buyTickets = function () {
    angular.forEach($scope.hallRows, function (row, key) {
      angular.forEach(row.seats, function (seat, key) {
        angular.forEach($scope.ticketsInProcess, function (ticket, key) {
          if (row.number === ticket.row && seat.number === ticket.number) {
            seat.inProcess = false;
            seat.booked = true;
            $scope.ticketsInProcess.splice($scope.ticketsInProcess.indexOf(ticket), 1);
          }
        });
      });
    });
    // Create json
    $scope.prepareJson = JSON.stringify($scope.hallRows);
    $http.put('https://api.myjson.com/bins/51klg', $scope.prepareJson);
  };

  // FN -> clear remote json
  $scope.clearJson = function () {
    $http.put('https://api.myjson.com/bins/51klg', []);
    $scope.hallRows = [
      {
        number: 1,
        seats: $scope.createSeats(1, 14, 130)
      },
      {
        number: 2,
        seats: $scope.createSeats(2, 14, 110)
      },
      {
        number: 3,
        seats: $scope.createSeats(3, 14, 90)
      },
      {
        number: 4,
        seats: $scope.createSeats(4, 14, 80)
      }
    ];
    $scope.ticketsInProcess = [];
  };

}]);