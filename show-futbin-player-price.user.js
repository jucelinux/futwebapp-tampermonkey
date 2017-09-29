// ==UserScript==
// @name        FUT Show Futbin player price
// @version     0.1.4
// @description Show the Futbin prices for players in the Search Results and Club Search
// @license     MIT
// @author      Tim Klingeleers
// @match       https://www.easports.com/fifa/ultimate-team/web-app/*
// @namespace   https://github.com/Mardaneus86
// @grant       GM_xmlhttpRequest
// @connect     www.futbin.com
// @updateURL   https://raw.githubusercontent.com/Mardaneus86/futwebapp-tampermonkey/master/show-futbin-player-price.user.js
// @downloadURL https://raw.githubusercontent.com/Mardaneus86/futwebapp-tampermonkey/master/show-futbin-player-price.user.js
// @supportURL  https://github.com/Mardaneus86/futwebapp-tampermonkey/issues
// ==/UserScript==
// ==OpenUserJS==
// @author Mardaneus86
// ==/OpenUserJS==
(function () {
  'use strict';

  $(document).bind('DOMNodeInserted', function (event) {
    if ($(event.target).hasClass("listFUTItem")) {
      // Get the player ID from the attached player image
      var playerImageUrl = $(event.target).find('.photo').attr('src');
      var playerId = playerImageUrl.substr(playerImageUrl.lastIndexOf('/') + 1).replace('.png', '');

      if(playerId.startsWith('p')) {
        playerId = playerId.substr(1);
      }

      var futbinUrl = "https://www.futbin.com/18/playerPrices?player=" + playerId;

      var ret = GM_xmlhttpRequest({
        method: "GET",
        url: futbinUrl,
        onload: function (res) {
          var data = JSON.parse(res.response);

          var platform = '';
          if (repositories.User.getCurrent().getSelectedPersona().isPlaystation) platform = "ps";
          if (repositories.User.getCurrent().getSelectedPersona().isPC) platform = "pc";
          if (repositories.User.getCurrent().getSelectedPersona().isXbox) platform = "xbox";

          var target = null;
          if ($(event.target).parents('#MyClubSearch').length > 0) {
            $(".secondary.player-stats-data-component").css('float', 'left');
            target = $(event.target).find('.entityContainer');
            target.append('<div class="auction" style="margin: 0; width: auto;"><span class="label">Futbin BIN</span><span class="coins value">' + data[playerId].prices[platform].LCPrice + '</span></div>');
          } else if ($(event.target).parents('.SearchResults').length > 0) {
            target = $(event.target).find('.auctionValue').parent();
            target.prepend('<div class="auctionValue"><span class="label">Futbin BIN</span><span class="coins value">' + data[playerId].prices[platform].LCPrice + '</span></div>');
          }
        }
      });
    }
  });
})();
