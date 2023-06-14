'use strict';

const Events = require('events');
const eventEmitter = new Events();

// Description: Event pool for socket.io events
const eventPool = {
  DISCONNECT: 'disconnect',
  START_GAME: 'start_game',
  END_GAME: 'end_game',
  NEW_GAME: 'new_game',

  AUTH_LOGIN: 'auth_login',
  AUTH_LOGOUT: 'auth_logout',
  PLAYER_SEARCH: 'player_search',

  USER_CHECK_ACCOUNT_RESPONSE: 'user_check_account_response',
  USER_CHECK_ACCOUNT: 'user_check_account',
  USER_CREATE_ACCOUNT: 'user_create_account',
  USER_CREATE_ACCOUNT_RESPONSE: 'user_create_account_response',
  USER_AUTHENTICATE_SUCCESS: 'user_authenticate_success',
  USER_AUTHENTICATE_ERROR: 'user_authenticate_error',
  USER_JOIN_SUCCESS: 'user_join_success',
  USER_LEAVE_SUCCESS: 'user_leave_success',
  USER_CREATE_SUCCESS: 'user_create_success',
  USER_CREATE_ERROR: 'user_create_error',
  USER_PROFILE_SUCCESS: 'user_profile_success',
  USER_PROFILE_ERROR: 'user_profile_error',
  USER_PROFILE_UPDATE_SUCCESS: 'user_profile_update_success',
  USER_PROFILE_UPDATE_ERROR: 'user_profile_update_error',
  USER_AUTHENTICATE: 'user_authenticate',
  USER_LOGIN: 'user_login',
  USER_LOGIN_RESPONSE: 'user_login_response',
  USER_LOGOUT: 'user_logout',
  USER_LOGOUT_SUCCESS: 'user_logout_success',
  USER_LOGOUT_RESPONSE: 'user_logout_response',
  USER_SEARCH: 'user_search',
  USER_PROFILE: 'user_profile',
  USER_JOIN: 'user_join',
  USER_LEAVE: 'user_leave',
  SEND_MESSAGE: 'send_message',

  CHARACTER_JOIN: 'character_join',
  CHARACTER_JOIN_SUCCESS: 'character_join_success',
  CHARACTER_JOIN_ERROR: 'character_join_error',
  CHARACTER_CREATE: 'character_create',
  CHARACTER_CREATE_SUCCESS: 'character_create_success',
  CHARACTER_CREATE_ERROR: 'character_create_error',

  CHARACTER_LEAVE: 'character_leave',
  CHARACTER_LEVELED_UP: 'character_leveled_up',
  CHARACTER_DEFEATED: 'character_defeated',
  CHARACTER_VICTORY: 'character_victory',
  CHARACTER_INVENTORY: 'character_inventory',

  CHARACTER_ACTION_ATTACK: 'character_action_attack',
  CHARACTER_ACTION_DEFEND: 'character_action_defend',
  CHARACTER_ACTION_HEAL: 'character_action_heal',
  CHARACTER_ACTION_FLEE: 'character_action_flee',
  CHARACTER_ACTION_CUSTOM: 'character_action_custom',
  CHARACTER_ACTION_PICKUP: 'character_action_pickup',

  ENEMY_SPAWN: 'enemy_spawn',
  ENEMY_KILLED: 'enemy_killed',
  LOOT_DROP: 'loot_drop',

  USER_JOIN_ERROR: 'user_join_error',
  USER_LEAVE_ERROR: 'user_leave_error',
  SEND_MESSAGE_ERROR: 'send_message_error',

  // Additional Events
  GAME_INQ: 'game_inq',
  ROOM_MENU: 'room_menu',
  CHAT_JOINED: 'chat_joined',
  LINE: 'line',
  CHAT_MESSAGE: 'chat_message',
  CLOSE: 'close',
  JOIN: 'join',

  // Dungeon Events
  DUNGEON_CREATE: 'dungeon_create',
  DUNGEON_CREATE_SUCCESS: 'dungeon_create_success',
  DUNGEON_CREATE_ERROR: 'dungeon_create_error',
  DUNGEON_JOIN: 'dungeon_join',
  DUNGEON_JOIN_SUCCESS: 'dungeon_join_success',
  DUNGEON_JOIN_ERROR: 'dungeon_join_error',
  DUNGEON_START: 'dungeon_start',
  DUNGEON_START_SUCCESS: 'dungeon_start_success',
  DUNGEON_START_ERROR: 'dungeon_start_error',
  DUNGEON_COMPLETE: 'dungeon_complete',
  DUNGEON_COMPLETE_SUCCESS: 'dungeon_complete_success',
  DUNGEON_FAIL: 'dungeon_fail',
  DUNGEON_LEAVE: 'dungeon_leave',
  DUNGEON_LEAVE_SUCCESS: 'dungeon_leave_success',
  DUNGEON_LEAVE_ERROR: 'dungeon_leave_error',
  DUNGEON_LIST: 'dungeon_list',
  DUNGEON_LIST_SUCCESS: 'dungeon_list_success',
  DUNGEON_LIST_ERROR: 'dungeon_list_error',
};

module.exports = {
  eventPool,
  eventEmitter,
};
