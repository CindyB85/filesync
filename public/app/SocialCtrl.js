'use strict';
angular
  .module('FileSync')
  .controller('SocialCtrl', ['$scope', 'SocketIOService', function($scope, SocketIOService) {
    this.viewers = [];
    this.messages = [];
    this.message = '';
    this.linkPin = [];

    function onViewersUpdated(viewers) {
      this.viewers = viewers;
      $scope.$apply();
    }

    SocketIOService.onViewersUpdated(onViewersUpdated.bind(this));

    function messageIsALink(message){
      if (message.indexOf("http")!=-1){
        console.log("c'est un lien");
        return message;
      }
    }

    this.sendMessage = function() {
      if( messageIsALink(this.message)){
        SocketIOService.sendLink(this.message);
        SocketIOService.sendMessage(this.message);
        this.message = '';
      } else {
        console.log(this.message);
        console.log("c'est un message");
        SocketIOService.sendMessage(this.message);
        this.message = '';
      }
    };

    function onMessagesUpdated(message) {
      this.messages.push(message);
      $scope.$apply();
    }

    SocketIOService.onMessagesUpdated(onMessagesUpdated.bind(this));

    function onLinkUpdated(message){
      this.linkPin.push(message);
      $scope.$apply();
    }

    SocketIOService.onLinkUpdated(onLinkUpdated.bind(this));

  }]);
