	function clsDbCommand(){
	/***********************************
	/*** PROPERTIES              ********************************
	/***********************************/
/*
console.log("My log message goes here.");
console.warn("My warning message goes here.");
console.error("My error message goes here.");
console.info("My information message goes here.");
*/
		this.strCurrentUser = "";
		this.strMediaSearch = "";
		this.strDateCode = ""
		this.objTalkBack = new Object;  // used for VB automation
		this.strXMLreq = "";
		this.strXMLexecpath = "";
		this.strClientKey = "";
		this.objXMLreq = Object;
		this.intSearchMode = search_targeting_loose;  	// defaul targeting mode, might want to put this in a profile somewhere
		//this.intSearchFieldType = type_artist;			// default search mode : search artist, might want to put this in a profile somewhere
		this.intSearchLength = duration_medium;			// default search mode : search artist, might want to put this in a profile somewhere
		this.intMediaQuality = media_all;  			// defaul targeting mode, might want to put this in a profile somewhere
		this.strSearchString = '';

		this.bHighBitrate = false;
		this.bLongSongs = false;
		this.bRefreshUI = false;
		this.bSysBusy = false;
		
		this.bUsePrototypeAjax = false;
		
		function cloneelement(){
			var o = new Object(); 
			for (var property in this) o[property] = typeof (this[property]) == 'object' ? this[property].clone() : this[property]
			return o
		}
		this.Collection = function(){
			this.clone = cloneelement;
			this.add = function(object){this.length++;this[this.length] = object};
			this.length = 0;
			return this
		}	
		/***********************************
	/*** TYPE DEFINITIONS        ********************************
	/***********************************/
		this.cls_recArtist = function(){
			this.clone = cloneelement;
			this.intColIdx = 0;
			this.intTypeID = type_artist;
			this.intID = 0;
			this.intStatus = status_void;
			this.intAccessLevel = 0;
			this.dtCreated = ''
			this.dtLastUpdate = '';
			this.intAlbumcount = 0; // "</alct>"
	        this.intSongcount = 0; // & "</snct>"
			this.strArtist = '';
			return this
		}			
		this.cls_recAlbum = function(){
			this.clone = cloneelement;
			this.intColIdx = 0;
			this.intTypeID = type_album;
			this.intID = 0;
			this.intStatus = status_void;
			this.intAccessLevel = 0;
			this.dtCreated = ''
			this.dtLastUpdate = '';
			this.intArtistID = 0;
			this.intGenreID = -99;
			this.strYear = '';
	        this.intSongcount = 0; // & "</snct>"
			this.strAlbum = '';
			this.strArtist = '';
			return this
		}			
		this.cls_recSong = function(){
			this.clone = cloneelement;
			this.intColIdx = 0;
			this.intID = 0;
			this.intTypeID = type_song;
			this.intStatus = status_void;
			this.intAccessLevel = 0;
			this.dtCreated = ''
			this.dtLastUpdate = '';
			this.intAlbumID = 0;
			this.intArtistID = 0;
			this.intServerID = 0;
			this.intGenreID = -99;
			this.lngForeignID = 0;
			this.strSong = '';
			this.strAlbum = '';
			this.strArtist = '';
			this.strComment = '';
			this.strGenre = '';
			this.strYear = '';
			this.strDuration = '';
			this.intBitRate = '';
			this.intMediaQuality = media_all; 
			return this
		}			
		this.cls_recFamily = function(){
			this.clone = cloneelement;
			this.intColIdx = 0;
			this.intID = 0;
			this.intTypeID = type_family;
			this.intStatus = status_void;
			this.intAccessLevel = 0;
			this.dtCreated = ''
			this.dtLastUpdate = '';
			this.strDetails = "";
			this.strName = '';
            this.strIP = "";
            this.intPort = 0;
            this.intStreamPort = 0;
            this.lngSeedLocal = 0;
			this.lbgSeedRemote = 0;
			return this
		}
		this.cls_recPlayer = function(){
			this.Status = player_stop;	//	<mps>
			this.strStatus = '';		//	<mss>
			this.intVolume = 0;		//	<mpv>
			this.bMute = false;		// 	<mpm>
			this.bMediaChanged = false;		// 	<mpm>
			this.intSongID = 0; // <idsg>
			this.intAlbumID = 0; // </idam>"
			this.intArtistID = 0; // /idat>"
			this.strSong = ""; // /nmsg>"
			this.strAlbum = ""; // /</nmam>"
			this.strArtist = ""; // /</nmat>"				
			return this
		}
		this.cls_recPlaylist = function(){
			this.clone = cloneelement;
			this.intColIdx = 0;
			this.intTypeID = type_playlist;
			this.intID = 0;
			this.intStatus = status_void;
			this.intAccessLevel = 0;
			this.dtCreated = ''
			this.dtLastUpdate = '';
			this.intSongcount = 0;
			this.strTitle = '';
			return this
		}			
		this.cls_recWebpage = function(){
			this.clone = cloneelement;
			this.intColIdx = 0;
			this.intTypeID = type_webpage;
			this.intID = 0;
			this.intStatus = status_void;
			this.intAccessLevel = 0;
			this.intParentID = 0;
			this.intPageType = 0;
			this.intActionID = 0;
			this.intOrderID = 0;
			this.strTitle = '';
			this.strDescription = '';
			this.txtPageContent = '';
			this.dtCreated = ''
			this.dtLastUpdate = '';
			return this
		}			
		this.cls_recGenre = function(){
			this.clone = cloneelement;
			this.intColIdx = 0;
			this.intTypeID = type_webpage;
			this.intID = -1;
			this.intStatus = status_void;
			this.intAccessLevel = 0;
			this.dtCreated = ''
			this.dtLastUpdate = '';
			this.strGenre = '';
		}
		this.cls_recDate = function()	{
			this.clone = cloneelement;
			this.intColIdx = 0;
			this.intTypeID = type_date;
			this.intID = 0;
			this.intStatus = status_void;
			this.intAccessLevel = 0;
			this.dtCreated = ''
			this.dtLastUpdate = '';
			this.strYear = '';
			this.intYear = -1;
			this.strMonth = '';
			this.intMonth = 0;
			this.strDay = '';				
			this.intDay = 0;
		}
		this.cls_recVoid = function()	{
			this.clone = cloneelement;
			this.intColIdx = 0;
			this.intTypeID = type_void;
			this.intID = 0;
			this.intStatus = status_void;
		}
		this.cls_recControl = function(){			//	main ajax control class, holds actions & data for XML object
			this.intQueryID = 0;					// 	database action id
			this.strQuery_1 = '';					//	data container, mostly holds the query string or number
			this.strQuery_2 = '';					//	data container, mostly holds the datatype
			this.strQuery_3 = '';					//  data container
			this.strSelSet = '';					//  data container, holds selections.
			this.ClientTypeID = 0;					//  the current Client PageInfo container type
			this.SearchType = type_artist;			// default search mode : search artist, might want to put this in a profile somewhere
			this.ServerTypeID = 0;					//  the current Server PageInfo container type
			this.ServerPageRecordCount = 0;			// number of records per serverpage
			return this
		}	
		this.cls_recPageInfo = function()	{		//	holds pagesize, index and record info for use with paging mechanism
			this.PanePosition = 0;					// start position of result pane
			this.ServerResultCount = 0;				// number of results returned by last query
			this.ServerPageCount = 0;				// number of pages returned by last query
			this.ServerPageIndex = 0;				// current server page index
			this.ServerPageRecordIndex = 0;			// index within playlist
			this.Selected = Object;					// reference to selected entry for the pageinfo struct
			this.Current = Object;					// reference to current entry for the pageinfo struct
			this.oSelected = Object;				// reference to selected object
			this.oCurrent = Object;					// reference to current object
		}
		/***********************************
	/*** COOKIE JAR *********************************************
	/***********************************/
		this.fn_cookie_get = function(cookieNaam){
			var cname = cookieNaam + "=";
			var i = 0;
			while (i < document.cookie.length) {
				var j = i + cname.length;
				if (document.cookie.substring(i, j) == cname){
					var leng = document.cookie.indexOf (";", j);
					if (leng == -1) leng = document.cookie.length;
					return unescape(document.cookie.substring(j, leng));
				}
				i = document.cookie.indexOf(" ", i) + 1;
				if (i == 0) break;
			}
//			return "*";
			return "";
		}
		this.fn_cookie_kill = function(cookieNaam){
			document.cookie = cookieNaam + "=; expires= Thu, 01-Jan-70 00:00:01 GMT";
			document.cookie = cookieNaam + "=; expires= Thu, 01-Jan-70 00:00:01 GMT; path=/";
			return true;
		}
		this.fn_cookie_set = function(cookieNaam, cookieInhoud){
			var today = new Date();
			var expiry = new Date(today.getTime() + 365 * 24 * 60 * 60 * 10000);
			document.cookie = cookieNaam + "= " + escape (cookieInhoud) + "; expires=" + expiry.toGMTString()+ "; path=/"
		}	
		/***********************************
	/*** TYPE METHODS            ********************************
	/***********************************/
		function GetNodeAttr(ID,sID){
			//if(sID == "ti")	console.log("GetNodeAttr.ServerTypeID :" + unescape(ID.getAttributeNode(sID).nodeValue))
			var Tekkel = unescape(ID.getAttributeNode(sID).nodeValue);
			if(WL.IsNumeric(Tekkel)) return parseInt(Tekkel); else return Tekkel;
		}
		function GetNodeVal(ID,sID){
			if(window.ActiveXObject)
			{
				var Tekkel = unescape(ID.selectSingleNode(sID).text);
				if(WL.IsNumeric(Tekkel)) return parseInt(Tekkel); else return Tekkel;
			}
			else
			{
				if(ID.getElementsByTagName(sID).length > 0)
				{
					var Tekkel = unescape(ID.getElementsByTagName(sID).item(0).textContent);
					if(WL.IsNumeric(Tekkel)) return parseInt(Tekkel); else return Tekkel;						
				}
				else return 0
			}
		}
		/***********************************
	/*** DATA COLLECTIONS        ********************************
	/***********************************/
		with(this){
			this.colServers = new Collection();
			this.colQuery = new Collection();			// used to store the results of any query
			//this.colUsers = new Collection();			// collection of user's workspace
		}
		/***********************************
	/*** DATA RECORDS   *****************************************
	/***********************************/
		with(this){
			this.PageInfo = [];
			this.PageInfo[type_artist] = new cls_recPageInfo();	
			with(this.PageInfo[type_artist]){
				clone = cloneelement;
				Selected = new cls_recArtist();
				Current = new cls_recArtist();
				oSelected = null;
				oCurrent = null;
			}
			this.PageInfo[type_album] = new cls_recPageInfo();	
			with(this.PageInfo[type_album]){
				clone = cloneelement;
				Selected = new cls_recAlbum();
				Current = new cls_recAlbum();
				oSelected = null;
				oCurrent = null;
			}
			this.PageInfo[type_song] = new cls_recPageInfo();	
			with(this.PageInfo[type_song]){
				clone = cloneelement;
				Selected = new cls_recSong();
				Current = new cls_recSong();
				oSelected = null;
				oCurrent = null;
			}
			this.PageInfo[type_playlist] = new cls_recPageInfo();	
			with(this.PageInfo[type_playlist]){
				clone = cloneelement;
				Selected = new cls_recPlaylist();
				Current = new cls_recPlaylist();
				oSelected = null;
				oCurrent = null;
			}
			this.PageInfo[type_genre] = new cls_recPageInfo();	
			with(this.PageInfo[type_genre]){
				clone = cloneelement;
				Selected = new cls_recGenre();
				Current = new cls_recGenre();
				oSelected = null;
				oCurrent = null;
			}
			this.PageInfo[type_playlist_song] = new cls_recPageInfo();	
			with(this.PageInfo[type_playlist_song]){
				clone = cloneelement;
				Selected = new cls_recSong();
				Current = new cls_recSong();
				oSelected = null;
				oCurrent = null;
			}
			this.PageInfo[type_year] = new cls_recPageInfo();	
			with(this.PageInfo[type_year]){
				Selected = new cls_recDate();
				Current = new cls_recDate();
				oSelected = null;
				oCurrent = null;
			}
			this.PageInfo[type_date] = new cls_recPageInfo();	
			with(this.PageInfo[type_date]){
				Selected = new cls_recDate();
				Current = new cls_recDate();
				oSelected = null;
				oCurrent = null;
			}
			this.PageInfo[type_family] = new cls_recPageInfo();	
			with(this.PageInfo[type_family]){
				Selected = new cls_recFamily();
				Current = new cls_recFamily();
				oSelected = null;
				oCurrent = null;
			}
			this.PageInfo[type_webpage] = new cls_recPageInfo();	
			with(this.PageInfo[type_webpage]){
				Selected = new cls_recWebpage();
				Current = new cls_recWebpage();
				oSelected = null;
				oCurrent = null;
			}
			this.recVoid = new cls_recVoid();
			this.Player = new cls_recPlayer();
			this.Control = new cls_recControl();	
		}
		this.fn_selecttocurrent = function(idType){
			with(this){
				PageInfo[idType].Current = PageInfo[idType].Selected.clone();
				Control.ClientTypeID = idType;
			}
		}
		this.fn_dbexec = function(ID,iAction){
			// used for processing playlist actions
			with(this){
				Control.strQuery_1 = ID
				Control.intQueryID = iAction;
				fn_queryexecute();
			}
		}
		/***********************************
	/*** year & genre enumerators *******************************
	/***********************************/
		this.fn_loadyearpresets = function(){
			with(this)
			{
				Control.intQueryID = db_browse_year;
				fn_queryexecute();
			}
		}
		this.fn_loadgenrepresets = function(){
			with(this)
			{
				Control.intQueryID = db_browse_genre;
				fn_queryexecute();
			}
		}
		this.fn_loadhistorypresets = function(){
			with(this)
			{
				Control.intQueryID = db_browse_history;
				fn_queryexecute();
			}
		}	
		/***********************************
	/*** PLAYLISTS  *********************************************
	/***********************************/
		/*this.fn_playlist_list = function(){
			with(this){
				Control.intQueryID = db_playlist_list;
				fn_queryexecute();
			}
		}*/
		this.fn_playlist_list_add = function(){
			with(this){
				Control.intQueryID = db_playlist_list_add;
				Control.strQuery_1 = PageInfo[type_playlist].Selected.strTitle;
				fn_queryexecute();
			}
		}	
		this.fn_playlist_list_artist_add = function(){
			with(this)
			{
				Control.intQueryID = db_playlist_list_artist_add;
				Control.strQuery_1 = PageInfo[type_playlist].Current.intID;   //  recCurrent.Playlist.intID;
				Control.strQuery_2 = PageInfo[type_artist].Selected.intID; //recSelected.Artist.intID;
				fn_queryexecute();
			}
		}	
		this.fn_playlist_list_album_add = function(){
			with(this)
			{
				Control.intQueryID = db_playlist_list_album_add;
				Control.strQuery_1 = PageInfo[type_playlist].Current.intID; //recCurrent.Playlist.intID;
				Control.strQuery_2 = PageInfo[type_album].Selected.intID; //recSelected.Album.intID;
				fn_queryexecute();
			}
		}	
		this.fn_playlist_list_song_add = function(){
			with(this)
			{
				Control.intQueryID = db_playlist_list_song_add;
				Control.strQuery_1 = PageInfo[type_playlist].Current.intID;   //recCurrent.Playlist.intID;
				Control.strQuery_2 = PageInfo[type_song].Selected.intID;   //recSelected.Song.intID;
				fn_queryexecute();
			}
		}
		this.fn_playlist_list_delete = function(){
			with(this)
			{
				Control.intQueryID = db_playlist_list_delete;
				Control.strQuery_1 = PageInfo[type_playlist].Selected.intID; 
				fn_queryexecute();
			}
		}	
		this.fn_playlist_list_entry_delete = function(sXML){
			with(this)
			{
				// removes songs from the colPlaylist collection
				Control.strQuery_1 = PageInfo[type_playlist].Selected.intID; //recSelected.Playlist.intID
				Control.strQuery_2 = PageInfo[type_song].Selected.intID; //recSelected.Song.intID
				Control.intQueryID = db_playlist_list_song_delete;
				fn_queryexecute();
				//colPlaylist = colQuery.clone();			
			}
		}
		this.fn_playlist_save_sortorder = function(sXML){
			with(this)
			{
				// adds a new song to the colPlaylist collection
				Control.strQuery_1 = recSelected.Playlist.intID
				Control.strSelSet = sXML
				Control.intQueryID = db_playlist_save_sortorder;
				fn_queryexecute();
			}
		}
		this.fn_playlist_list_update = function(){
			with(this){
				// adds a new song to the colPlaylist collection
				Control.strQuery_1 = PageInfo[type_playlist].Selected.intID; 
				Control.strQuery_2 = PageInfo[type_playlist].Selected.strTitle;
				Control.intQueryID = db_playlist_list_update;
				fn_queryexecute();
			}
		}
		this.fn_playlist_list_songs = function(intPlaylistID){
			with(this)
			{
				if(intPlaylistID) PageInfo[type_playlist].Selected.intID = intPlaylistID;
				fn_selecttocurrent(type_playlist)
				Control.intQueryID = db_playlist_list_songs;
				Control.strQuery_1 = PageInfo[type_playlist].Current.intID; //recCurrent.Playlist.intID;
				fn_queryexecute();
			}
		}	
		this.fn_playlist_list_albums = function(intPlaylistID){
			with(this)
			{
				if(intPlaylistID) PageInfo[type_playlist].Selected.intID = intPlaylistID;
				fn_selecttocurrent(type_playlist)
				Control.intQueryID = db_playlist_list_albums;
				Control.strQuery_1 = PageInfo[type_playlist].Current.intID; //recCurrent.Playlist.intID;
				fn_queryexecute();
			}
		}	
		this.fn_playlist_list_artists = function(intPlaylistID){
			with(this)
			{
				if(intPlaylistID) PageInfo[type_playlist].Selected.intID = intPlaylistID;//recSelected.Playlist.intID = intPlaylistID;
				fn_selecttocurrent(type_playlist)
				Control.intQueryID = db_playlist_list_artists;
				Control.strQuery_1 = PageInfo[type_playlist].Current.intID; //recCurrent.Playlist.intID;
				fn_queryexecute();
			}
		}							
		/***********************************
	/*** SEARCH                  ********************************
	/***********************************/
		this.fn_search_execute = function(){
			with(this)
			{
				with(Control)
				{
					intQueryID = db_search;
					strQuery_1 = strMediaSearch;
					strQuery_2 = ClientTypeID;
					strQuery_3 = intSearchMode;
					strSelSet = "<dtyr>" + escape(PageInfo[type_year].Selected.strYear) + "</dtyr><geid>" + PageInfo[type_genre].Selected.intID + "</geid><brte>" + ((bHighBitrate) ? "1" : "0") + "</brte><bsdr>" + ((bLongSongs) ? "1" : "0") + "</bsdr>";		
				}
				fn_queryexecute();
			}
		}
		/***********************************
	/*** BROWSE                  ********************************
	/***********************************/
		this.fn_gethistory = function(strDtCode){
			with(this)
			{
				// split Datecode into day, month and year
				var DateCode = (strDtCode !="") ? strDtCode : strDateCode
				var arr_date = DateCode.split(":");
				with(Control)
				{
					intQueryID = db_browse_history_selection;
					strQuery_1 = strMediaSearch;
					strQuery_2 = ClientTypeID;
					strQuery_3 = intSearchMode;
					strSelSet = "<dtyr>" + arr_date[2] + "</dtyr><dtmh>" + arr_date[1] + "</dtmh><dtdy>" + arr_date[0] + "</dtdy><geid>" + PageInfo[type_genre].Selected.intID + "</geid>"
				}
				fn_queryexecute();
			}
		}
		this.fn_browse_song_year = function(intYear){
			with(this)
			{
				// returns a list of all years in the database
				Control.strQuery_1 = intYear;
				Control.intQueryID = db_browse_song_year;
				fn_queryexecute();
			}
		}
		this.fn_browse_song_albums = function(intSongID){
			with(this)
			{
				Control.strQuery_1 = intSongID;
				Control.intSongID = intSongID;
				Control.intQueryID = db_browse_song_albums;
				fn_queryexecute();
			}
		}
	/***********************************
	/*** GENRES                  *******
	/***********************************/
		this.fn_browse_genre = function(){
			with(this)
			{
				Control.intQueryID = db_browse_genre;
				fn_queryexecute();
			}
		}
		this.fn_browse_page = function(iPage){
			with(this){
				Control.intQueryID = db_browse_page;
				Control.strQuery_1 = iPage;
				Control.strQuery_2 = Control.ClientTypeID;
				fn_queryexecute();
			}
		}
	/***********************************
	/*** SONGS                   *******
	/***********************************/
		this.fn_browse_history_log = function(intSongID){
			with(this)
			{
				Control.intSongID = intSongID;
			}
		}

	/***********************************
	/*** SYSTEM & SELECTIONLOGIC  ******
	/***********************************/
		this.fn_talkback = function(iAction){	// called by parent VB server
			// normally we need a browsercheck here but since this method is called 
			// by the server IE object window only we can savely assume it's IE.
			var objXMLresult = new ActiveXObject("Microsoft.XMLDOM");	
			with(this){
				objXMLresult.loadXML(objTalkBack.value);
				fn_process_xml_result(objXMLresult);
				fn_update(iAction)
			}
		}
		this.fn_player_server = function(){
			with(this){ 
				Control.strQuery_1 = PageInfo[Control.ClientTypeID].Selected.intID; //intColIdx;
				Control.strQuery_2 = Control.ClientTypeID;
				Control.strQuery_3 = PageInfo[Control.ClientTypeID].ServerPageIndex;
				Control.intQueryID = db_player_start;
				fn_queryexecute();
			}
		}
		this.fn_server_setvolume = function(iVol){
			with(this){ 
				Player.intVolume = iVol;
				Control.strQuery_1 = iVol;
				Control.intQueryID = db_player_volume;
				fn_queryexecute();
			}
		}
		this.fn_server_mute = function(){
			with(this)
			{ 
				Control.intQueryID = (DataCommand.Player.bMute) ? db_player_mute:db_player_unmute;
				fn_queryexecute();
			}
		}
		this.fn_mainmenu = function(){
			with(this)
			{ 
				// normally all menufunction are handled by the Tellavision class but since this one calls the server directly it sits in dbcommand
				Control.intQueryID = 0;
				fn_queryexecute();
			}
		}
		this.fn_server_sendmediamessage = function(idMessage){
			with(this){ 
				Control.intQueryID = idMessage;
				fn_queryexecute();
			}
		}
		this.fn_pingpong = function(){
			with(this){ 
				Control.intQueryID = db_system_status;
				fn_queryexecute();
				return bRefreshUI;
			}
		}		
		/***********************************
	/*** WEBTREE CMS ********************************************
	/***********************************/
		this.fn_webtree_topic_get = function(id,bWithBlob){
			with(this)
			{ 
				Control.intQueryID = db_webtree_topic_get;
				Control.strQuery_1 = id;
				Control.strQuery_2 = (bWithBlob) ? '1':'0';
				fn_queryexecute();
			}
		}
		this.fn_webtree_topic_children = function(id){
			with(this)
			{ 
				Control.intQueryID = db_webtree_topic_children;
				Control.strQuery_1 = id;
				fn_queryexecute();
			}
		}	
		/***********************************
	/*** UNDOREDO & DBXML        ********************************
	/***********************************/
		this.GetSongIndex = function(objCol,intID){
			var iIndex;
			for(iIndex in objCol)
			{
				if (objCol[iIndex].intSongID == intID) return iIndex-1; // js array base = 1, dhtml collection base = 0
			}
			return 1;
		}
		this.strErrorCode = function(intErrCode){
			switch(intErrCode)
			{
				case priv_guest: 
					return "no error";
					break
				case priv_user: 
					return "you need to be a registered user to perform this action";
					break
				case priv_family:
					return "you need to be a friend to perform this action";
					break
				default:
					return "unspecified error " + intErrCode + ", contact piratelogic";
					break
			}
		}
		
		

		this.fn_initialize= function(sXMLpath){
			with(this){
				strXMLexecpath = sXMLpath;
				PageInfo[type_artist].oSelected = null;
				PageInfo[type_album].oSelected = null;
				PageInfo[type_song].oSelected = null;
				//PageInfo[type_user].oSelected = null;
				PageInfo[type_playlist].oSelected = null;
				PageInfo[type_genre].oSelected = null;
				PageInfo[type_playlist_song].oSelected = null;
				PageInfo[type_year].oSelected = null;
				PageInfo[type_date].oSelected = null;
				PageInfo[type_family].oSelected = null;
				PageInfo[type_webpage].oSelected = null;
				strClientKey = fn_cookie_get("terratunes");	
				
				if(window.Prototype){
					bUsePrototypeAjax = true
					if (!window.ActiveXObject){
						var serializer = new XMLSerializer();
					}
				}else{
					var serializer = new XMLSerializer();
					if(strXMLexecpath !=''){
						objXMLreq = new XMLHttpRequest();
						with(objXMLreq){
							//onerror = function(){alert('XMLHttpRequest error');}
							onreadystatechange = function(){if (readyState == 4) fn_process_xml_result(responseXML)}
						}
					}
				}
				Control.intQueryID = family_list;
				fn_queryexecute();
				fn_cookie_set("terratunes",strClientKey);		
				colServers = colQuery.clone();
			}
		}
		this.fn_queryexecute = function(){
			with(this){
				bSysBusy = true;
				strXMLreq = "<xml ck=\"" + strClientKey + "\" s1=\"" + escape(Control.strQuery_1) + "\" s2=\"" + escape(Control.strQuery_2) + "\"";
				strXMLreq += " s3=\"" + escape(Control.strQuery_3) + "\" s4=\"" + intMediaQuality + "\"";
				strXMLreq += " rc=\"" + ((WL.GetBit(uistate,uistate_remote))?1:0) + "\" dp=\"" + Control.intQueryID + "\">" + Control.strSelSet + "</xml>";
				if(strXMLexecpath==''){ // no xml processor path was issued, communicate directly to the parent VB server
					with(objTalkBack){
						value = strXMLreq;
						action = Control.intQueryID;
						fireEvent("onchange");
					}
				}else{
					if(bUsePrototypeAjax){
						if (!window.ActiveXObject)
						{
							var serializer = new XMLSerializer();
							var Fiets = new Ajax.Request(strXMLexecpath,{asynchronous:false,postBody:strXMLreq, onSuccess:function(t){fn_process_xml_result(serializer.serializeToString(t.responseXML))}, onFailure:function(t){alert('Ajax.Request.error: ' + t.status + ' -- ' + t.statusText);}});	
						}
						else
						{
							var Fiets = new Ajax.Request(strXMLexecpath,{asynchronous:false,postBody:strXMLreq, onSuccess:function(t){fn_process_xml_result(t.responseXML)}, onFailure:function(t){alert('Ajax.Request.error: ' + t.status + ' -- ' + t.statusText);}});	
						}
					}else
					with(objXMLreq){
						open("POST", strXMLexecpath, false);
						setRequestHeader("Content-Type", "text/xml");
						send(strXMLreq);
					}
				}
			}
	    }
		this.fn_process_xml_result = function(objXML){
			var objRootNode = Object;
			var NewRec = Object;		
			var intErrorCode = 0;
			var intProcedure = 0;
			var intTempID = 0;
			if (!window.ActiveXObject) var serializer = new XMLSerializer();
			with(this){
				SelectionSet = "";
				objRootNode = objXML.getElementsByTagName("xml")[0];
				intProcedure = GetNodeAttr(objRootNode,"dp");
				intErrorCode = GetNodeAttr(objRootNode,"ie")
				strClientKey = GetNodeAttr(objRootNode,"ckey");
				Control.ServerTypeID = GetNodeAttr(objRootNode,"ti")
				//console.info("strClientKey:" + strClientKey + "    Control.ServerTypeID = " + Control.ServerTypeID);
				with(PageInfo[Control.ServerTypeID]){
					ServerResultCount = GetNodeAttr(objRootNode,"rc");		// total number of records returned last query
					ServerPageCount = GetNodeAttr(objRootNode,"pc");		// number of pages returned by last query
					ServerPageIndex = GetNodeAttr(objRootNode,"pi");		// current server page index
					ServerPageRecordIndex = GetNodeAttr(objRootNode,"px");	// index within playlist
				}
				with(Player){
					Status = GetNodeAttr(objRootNode,"mpsts")			//	<mps>
					bMute = (GetNodeAttr(objRootNode,"mpmte") == "1")		// 	<mpm>
					intArtistID = GetNodeAttr(objRootNode,"mpida")
					lngForeignID = GetNodeAttr(objRootNode,"mpidf")
					strSong = GetNodeAttr(objRootNode,"mpnms")
					strArtist = GetNodeAttr(objRootNode,"mpnma")
					intTempID = GetNodeAttr(objRootNode,"mpids") 
					bRefreshUI = ((strXMLexecpath != '') && (intSongID != intTempID))
					intSongID = intTempID
					// check if volume changed, if so set bRefreshUI flag
					if(bRefreshUI){
						intVolume = GetNodeAttr(objRootNode,"mpvol")			//	<mpv>
					}else{
						intTempID = GetNodeAttr(objRootNode,"mpvol")			//	<mpv>
						bRefreshUI = ((strXMLexecpath != '') && (intVolume != intTempID))
						intVolume = intTempID
					}
				}
				//strCurrentUser = GetNodeAttr(objRootNode,"unm")
				if(intErrorCode != '0')
					alert("datacommand.ajax.error: " + serializer.serializeToString(objRootNode))
				else{
					if(PageInfo[Control.ServerTypeID].ServerResultCount > 0){
						var objThisNode = objXML.getElementsByTagName("le");
						intRecordCount = objThisNode.length;
						colQuery.length = 0;
						for (i=0; i < intRecordCount; i++){
							switch(Control.ServerTypeID){
								case type_artist: NewRec = new cls_recArtist;break
								case type_album: NewRec = new cls_recAlbum;break
								case type_song: NewRec = new cls_recSong;break
								case type_family: NewRec = new cls_recFamily;break
								case type_playlist: NewRec = new cls_recPlaylist;break
								case type_playlist_song: NewRec = new cls_recSong;break
								case type_date: NewRec = new cls_recDate;break
								case type_year: NewRec = new cls_recDate;break
								case type_genre: NewRec = new cls_recGenre;break
								case type_webpage: NewRec = new cls_recWebpage;break
							}
							with(NewRec){
								intTypeID = Control.ServerTypeID;  //GetNodeAttr(objThisNode[i],"tyid");
								intID = GetNodeAttr(objThisNode[i],"rcid");
								intColIdx = i;
								intStatus = GetNodeAttr(objThisNode[i],"stat");
								intAccessLevel = GetNodeAttr(objThisNode[i],"accs");
								dtCreated = GetNodeVal(objThisNode[i],"dtcd");
								dtLastUpdate = GetNodeVal(objThisNode[i],"dtlu");
								switch(Control.ServerTypeID){
									case type_family:
							            strIP = GetNodeVal(objThisNode[i],"svip");
										strName = GetNodeVal(objThisNode[i],"svnm");
										strDetails = GetNodeVal(objThisNode[i],"svds");
							            intPort = GetNodeVal(objThisNode[i],"port");
							            intStreamPort = GetNodeVal(objThisNode[i],"spor");
							            lngSeedLocal = GetNodeVal(objThisNode[i],"sell");
							            lbgSeedRemote = GetNodeVal(objThisNode[i],"serm");
										colQuery.add(NewRec); 
										break
									case type_webpage: 
										intParentID = GetNodeVal(objThisNode[i],"paid");
										intPageType = GetNodeVal(objThisNode[i],"ttid");
										intActionID = GetNodeVal(objThisNode[i],"taid");
										intOrderID = GetNodeVal(objThisNode[i],"orid");
										strTitle = GetNodeVal(objThisNode[i],"ttle");
										strDescription = GetNodeVal(objThisNode[i],"desc");
										txtPageContent = GetNodeVal(objThisNode[i],"blop");
										colQuery.add(NewRec); 
										break
									case type_playlist:
										strTitle = GetNodeVal(objThisNode[i],"ttle");
										intSongcount = GetNodeVal(objThisNode[i],"snct"); // & "</snct>"
										colQuery.add(NewRec); 
										break
									case type_year:
										intYear = GetNodeVal(objThisNode[i],"dtyr");
										colQuery.add(NewRec); 
										break
									case type_date:
										intYear = GetNodeVal(objThisNode[i],"dtyr");
										intMonth = GetNodeVal(objThisNode[i],"dtmh");
										intDay = GetNodeVal(objThisNode[i],"dtdy");
										strYear = "";
										strMonth = "";
										strDay = "";
										colQuery.add(NewRec); 
										break
									case type_genre:
										strGenre = GetNodeVal(objThisNode[i],"ttle");
										colQuery.add(NewRec); 
										break
									case type_artist:
										intAlbumcount = GetNodeVal(objThisNode[i],"alct"); // "</alct>"
										intSongcount = GetNodeVal(objThisNode[i],"snct"); // & "</snct>"
										strArtist = GetNodeVal(objThisNode[i],"arts");
										colQuery.add(NewRec); 
										break
									case type_album:
										intSongcount = GetNodeVal(objThisNode[i],"snct"); // & "</snct>"
										intArtistID = GetNodeVal(objThisNode[i],"arid");
										strArtist = GetNodeVal(objThisNode[i],"arts");
										strAlbum = GetNodeVal(objThisNode[i],"ttle");
										strYear = GetNodeVal(objThisNode[i],"year");
										colQuery.add(NewRec); 
										break
									case type_song: case type_playlist_song:
										intArtistID = GetNodeVal(objThisNode[i],"arid");
										intGenreID = GetNodeVal(objThisNode[i],"geid");
										intTrackID = GetNodeVal(objThisNode[i],"trid");
										intServerID = GetNodeVal(objThisNode[i],"svid");
										lngForeignID = GetNodeVal(objThisNode[i],"fsid");
										strSong = GetNodeVal(objThisNode[i],"ttle");
										strArtist = GetNodeVal(objThisNode[i],"arts");
										strAlbum = GetNodeVal(objThisNode[i],"albm");
										strComment = GetNodeVal(objThisNode[i],"comm");
										strGenre = GetNodeVal(objThisNode[i],"gnre");
										strYear = GetNodeVal(objThisNode[i],"year");
										strDuration = GetNodeVal(objThisNode[i],"durn");
										intBitRate = GetNodeVal(objThisNode[i],"brte");
										intMediaQuality = GetNodeVal(objThisNode[i],"mqal");
										colQuery.add(NewRec); 
										break
								}
							}
						}

					}
					else colQuery.length = 0;
				}
				bSysBusy = false;
			}
		}
	}