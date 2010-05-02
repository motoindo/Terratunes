	/**********************************************************************************************************************************************************
	/*** UIcontrol IDs : 0 playerstatus ***********************************************************************************************************************
	/**********************************************************************************************************************************************************/
	var player_unknown = 0;			// player has not been initialized yet
	var player_stop = 1;			// Stopped Playback of the current media item is stopped. 
	var player_pause = 2;			// Paused Playback of the current media item is paused. When a media item is paused, resuming playback begins from the same location. 
	var player_playing = 3;			// Playing The current media item is playing. 
	var player_scanforward = 4;		// The current media item is fast forwarding. 
	var player_scanreverse = 5;		//  The current media item is fast rewinding. 
	var player_buffering = 6;		//  The current media item is getting additional data from the server. 
	var player_waiting = 7;			//  Connection is established, but the server is not sending data. Waiting for session to begin. 
	var player_mediaended = 8;		//  Media item has completed playback.  
	var player_transitioning = 9;	//  Preparing new media item. 
	var player_ready = 10;			//  Ready to begin playing. 
	var player_reconnecting = 11;	//  Reconnecting to stream. 	
	var player_start = 12;
	var player_resume = 13;
	var player_previous = 14;
	var player_next = 15;
	var player_video = 16;
	var player_preview = 17;
	
	/**********************************************************************************************************************************************************
	/*** UIcontrol IDs : 1000 KEYBOARD ************************************************************************************************************************
	/**********************************************************************************************************************************************************/

	
	var mouse_left			= 3000;
	var mouse_left_sticky	= 3001;
	var mouse_wheel			= 3002;
	var mouse_wheel_sticky	= 3003;
	var mouse_right			= 3004;
	var mouse_right_sticky	= 3005;
	var mouse_over 			= 3006;
	var mouse_out	 		= 3007;	
	var mouse_up 			= 3008;
	var mouse_down 			= 3009;
	var mouse_dblclick 		= 3010;
	var mouse_move 			= 3011;

	var key_down = 101;
	var key_up = 102;


	/**********************************************************************************************************************************************************
	/*** BITMASKS *********************************************************************************************************************************************
	/**********************************************************************************************************************************************************/
	var uicmd = 0;
	var uicmd_void = 0;
	var uicmd_search = 1;
	var uicmd_coverflow = 2;
	var uicmd_mplayer = 3;
	var uicmd_shutdown = 4;
	var uicmd_home = 5;
	var uicmd_setvolume = 6;
	var uicmd_refresh = 7;
	
	var uistate = 0;					// 	holds the cosmetic state the client UI is in
	var uistate_headermenu = 		0x1;			//	set if header is visible
	var uistate_mplayer = 			0x2;			// 	set in rc mode
	var uistate_keyboard = 			0x4;
	var uistate_message = 			0x8;		
	var uistate_message_chatbox = 	0x10;
	var uistate_message_mediabox = 	0x20;
	var uistate_message_execute =  	0x40;
	var uistate_message_inputbox = 	0x80;
	var uistate_results = 			0x100;  //16;
	var uistate_footer = 			0x200; //32;
	var uistate_select = 			0x400; //64;
	var uistate_remote = 			0x800;
	var uistate_splash = 			0x1000; //256;
	var uistate_landscape = 		0x2000;
	var uistate_searchmode = 		0x4000;
	var uistate_history = 			0x8000;
	var uistate_playlist = 			0x10000;
	var uistate_playlist_new = 		0x20000;
	var uistate_playlist_update = 	0x40000;
	var uistate_playlist_delete = 	0x80000;
	var uistate_family = 			0x100000;
	
	var status_void	= 		0x1;
	var status_current = 	0x2;
	var status_selected = 	0x4;

	
	//							songs									playlists								mod media		add/delete media
	var priv_guest = 0		//	allowed to listen 100%					readonly								readonly		denied
	var priv_user = 1		//	allowed to listen 10%					readonly when priv => priv_user			readonly		denied
	var priv_family =	2	//	allowed 100% when priv => priv_family	readonly when priv => priv_family		readonly		denied
	var priv_owner =	3	//	allowed 100% when priv => priv_owner	modify when priv => priv_owner			allowed			allowed owned	
	/**********************************************************************************************************************************************************
	/*** DATABASE CLEANED UP ENTRIES **********************************************************************************************************************
	/**********************************************************************************************************************************************************/


	var db_distinct_songs = 52
	var db_clone_artist = 53
	var db_clone_album = 54
	var db_clone_song = 55
	var db_update_song = 56
	var db_update_artist = 57
	var db_update_album = 58
	var db_remove_artist = 59
	var db_remove_album = 60
	var db_remove_song = 61	
	var db_cleanup_songs = 62
	var db_item_details = 63
	
	

	
	
	
	var db_system_status = 71
    var db_system_xmlready = 72
	var db_system_key = 73
	

	/**********************************************************************************************************************************************************
	/*** UIcontrol IDs : 0-99 collection type_id's  ***********************************************************************************************************
	/**********************************************************************************************************************************************************/
	var type_artist = 0;
	var type_album = 1;
	var type_song = 2;
	var type_playlist = 3;
	var type_playlist_song = 4;
	var type_genre = 5;
	var type_year = 6;
	var type_date = 7;
	var type_family = 8;
	var type_webpage = 9;

	var type_container = 10;
	var type_toolbar_button = 11;
	var type_image_jpg = 12;
	var type_image_gif = 13;
	var type_image_png = 14;
	var type_void = 15;

	


	/**********************************************************************************************************************************************************
	/*** UIcontrol IDs : 200-299 PLAYLISTS ********************************************************************************************************************
	/**********************************************************************************************************************************************************/
	var db_playlist_void = 0;					// do nothing
	var db_playlist_list = 200					//	display all playlists for a specific user
	var db_playlist_list_add = 201				//	add a new playlist
	var db_playlist_list_delete = 202			//	remove a playlist
	var db_playlist_list_update = 203			//	update playlist details
	var db_playlist_list_artist_add = 204		//	add all songs from an artist
	var db_playlist_list_album_add = 205		//	add all songs from an album
	var db_playlist_list_song_add = 206			//	add one song to a playlist
	var db_playlist_list_song_delete = 207		//	delete one song from a playlist
	var db_playlist_list_default = 208			//	set a playlist to be the default startup playlist
	var db_playlist_list_artist_delete = 209	//	list all artists within a playlist
	var db_playlist_list_album_delete = 210		//	list all albums within a playlist
	var db_playlist_save_sortorder = 211		//  save new sortorder
	var db_playlist_list_artists = 212			//  display playlist artists
	var db_playlist_list_albums = 213			//  display playlist albums
	var db_playlist_list_songs = 214			//  display playlist songs
	var db_playlist_list_clear = 215			//  clear playlist contents
	var db_playlist_copysongs = 216				//	used to copy the song collection into the playlistsongs collection
	/**********************************************************************************************************************************************************
	/*** UIcontrol IDs : 300-399 browse ***********************************************************************************************************************
	/**********************************************************************************************************************************************************/
	var db_browse_void = 0;						// do nothing
	var db_browse_song_year = 300;				// return all songs within selected year
	var db_browse_song_albums = 301;			// return all albums containing selected song
	var db_browse_song_artists = 306;
	var db_browse_song_twins = 302;				// return all songs with the identical names
	var db_browse_song_twins_artists = 303;		// return all artists with identical songs
	var db_browse_songs_foreign = 304;			// return all artists with identical songs
	var db_browse_year = 305;					// return all years current in db

	var db_browse_album_songs = 310;			// return all songs for on selected album
	var db_browse_album_artists = 311;			// return all artists for selected album 
	var db_browse_album_songs_artist = 312;		// return all songs for an artist on selected album 
	
	var db_browse_artist_songs = 320;			// return all songs for an artist
	var db_browse_artist_albums = 321;			// returns all albums for an artist excluding VA albums
	var db_browse_artist_albums_va = 322;		// returns all albums for an artist including VA albums

	
	
	var db_browse_genre = 330;					// returns all genres
	var db_browse_genre_artists = 331;			// returns all artists for selected genre
	var db_browse_genre_albums = 332;			// returns all albums for selected genre
	var db_browse_genre_songs = 333;			// returns all songs for selected genre

	var db_browse_history = 340                // returns all songs
	var db_browse_history_today = 341      // returns songs played today
	var db_browse_history_yesterday = 342      // returns songs played today
	var db_browse_history_week = 343      // returns songs played today
	var db_browse_history_month = 344      // returns songs played today
	var db_browse_history_selection = 345      // returns songs played today



    var db_browse_page = 350                   // request page in recordset
	var db_browse_firstpage = 351				// request first page in recordset
    var db_browse_previouspage = 352			// request previous page in recordset
    var db_browse_nextpage = 353				// request next page in recordset
    var db_browse_lastpage = 354				// request last page in recordset
	/**********************************************************************************************************************************************************
	/*** UIcontrol IDs : 400-499 search ***********************************************************************************************************************
	/**********************************************************************************************************************************************************/
	var db_search = 400;
	var db_search_clear = 401;
	var search_targeting_begin = 414;
	var search_targeting_exact = 415;
	var search_targeting_loose = 416;

	var media_flac = 417;
	var media_mp3 = 418;
	var media_grps = 419;
	var media_all = 420;
	
	var duration_short = 430;
	var duration_medium = 431;
	var duration_long = 432;

	/**********************************************************************************************************************************************************
	/*** WEBTREE : 500-599 ************************************************************************************************************************************
	/**********************************************************************************************************************************************************/
	
    var db_webtree_topic_add = 500
    var db_webtree_topic_move = 501
    var db_webtree_topic_sort = 502
    var db_webtree_topic_delete = 503
    var db_webtree_topic_get = 504
    var db_webtree_topic_update = 505
    var db_webtree_topic_children = 506

    var db_webtree_processimage = 507
    var db_webtree_saveproperties = 508

    var db_webtree_saveuserprofile = 509
    var db_webtree_getuserprofile = 510
    var db_webtree_createuserkey = 511
    var db_webtree_writesite = 512
    var db_webtree_loadwebtree = 513
    var db_webtree_initwebtree = 514
    var db_webtree_updatesortorder = 515
    var db_webtree_stripfamily = 516

    var db_webtree_publishnavigation = 517
    var db_webtree_publishtopic = 518
    var db_webtree_publishresource = 519
    var db_webtree_revokeresource = 520
    var db_webtree_addresource = 521
    var db_webtree_removeresource = 522

    var db_webtree_importgallery = 523
    var db_webtree_listtopicresources = 524

    var db_webtree_readsetup = 525
    var db_webtree_writesetup = 526
    var db_webtree_truncatedb = 527

    var db_webtree_saveserver = 528
    var db_webtree_readserver = 529
    var db_webtree_listftpservers = 530
    var db_webtree_listchildsites = 531
        
    var db_webtree_totalproductionsize = 532
    var db_webtree_xmltree = 533
	
	/**********************************************************************************************************************************************************
	/*** LISTS : 600-699 ***************************************************************************************************************************************
	/**********************************************************************************************************************************************************/
	var list_moveup = 600
	var list_movedown = 601
	var uicmd_submit = 602
	var uicmd_context = 603; 

	/**********************************************************************************************************************************************************
	/*** UIcontrol IDs : 700-799 USERS **************************************************************************************************************************
	/**********************************************************************************************************************************************************/
    var family_list = 700      //   list family members
    var family_invite = 701    //   send an invitation
    var family_accept = 702    //   accept an invitation
    var family_scan = 703      //   scan family for changes

	
    var db_storage_list = 720            // returns a list of all storagelocations
    var db_storage_scan = 721            // scan a storagelocation
    var db_storage_import = 722          // import from a friend db
    var db_storage_export = 723          // export to a friend db
    var db_storage_xmlupdate = 724  	
		

	
	/**********************************************************************************************************************************************************
	/*** UIcontrol IDs : 800 WEBPAGE TYPEID/ACTIONID'S  *******************************************************************************************************
	/**********************************************************************************************************************************************************/
	
	
	
	var db_player_start = 810;
	var db_player_stop = 811;
	var db_player_pause = 812;
	var db_player_resume = 813;
    var db_player_volume = 814;
    var db_player_mute = 815;
    var db_player_unmute = 816
	var db_player_previous = 817;
	var db_player_next = 819;
    var db_player_video = 820;	
	
	
	/**********************************************************************************************************************************************************
	/*** UIcontrol IDs : 900 CONTROLVARIABLES  ************************************************************************************************************************
	/**********************************************************************************************************************************************************/

	var sys_shutdown = 1000;

	/**********************************************************************************************************************************************************
	/*** SYSTEM CONTROL VARIABLES  ****************************************************************************************************************************
	/**********************************************************************************************************************************************************/
	var intCurrentVolumeLevel = 5;
	var strDisplayClass = "clsResult_Box_Song";
	var bSongEnded = false;
	var bEnableScriptaculous = false
	var iPlayerState = 0;
	var bVideoMode = false;

	var enumVBUImode = {
	    koekeloer_main:0,
	    koekeloer_about:1,
	    koekeloer_settings:2,
	    touch_key:3,
	    touch_main:4,
	    touch_busy:5
		};
