'use strict';
angular.module('FileSync')
  .factory('SocketIOService', ['io', '_', '$timeout', function(io, _, $timeout) {
    var socket = io();
    var _onFileChanged = _.noop;
    var _onVisibilityStatesChanged = _.noop;
    var nickname = '';

    socket.on('connect', function() {
      console.log('connected');
      nickname = prompt('Pseudo ?');
      socket.emit('viewer:new', nickname);
    });

    socket.on('users:visibility-states', function(states) {
      $timeout(function() {
        _onVisibilityStatesChanged(states);
      });
    });

    socket.on('error:auth', function(err) {
      // @todo yeurk
      alert(err);
    });

    return {
      onViewersUpdated: function(f) {
        socket.on('viewers:updated', f);
      },

      sendMessage: function(msg) {
        socket.emit('message:new', msg);
      },

      onMessagesUpdated: function(tchat) {
        socket.on('message:updated', tchat);
      },

      sendLink: function(msg) {
        socket.emit('link:new', msg);
      },

      onLinkUpdated: function(msgs){
      socket.on('link:updated', msgs);
      },

      onFileChanged: function(f) {
        _onFileChanged = f;
      },

      onVisibilityStatesChanged: function(f) {
        _onVisibilityStatesChanged = f;
      },

      userChangedState: function(state) {
        socket.emit('user-visibility:changed', state);
      }
    };
  }]);
