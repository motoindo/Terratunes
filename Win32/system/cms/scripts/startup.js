		var WebLib = new clsWebLibrary();			//	generic function library
		var DataCommand = new clsDbCommand();		//	database ajax layer
		var TellaVision = new clsTellaVision();		//	main navigation & content handling
		
		function StartupUI()
		{
			DataCommand.strDbXMLpath = "sys.xml";
			TellaVision.intControlBarButtonWidth = 110;
			TellaVision.intControlBarButtonHeight = 71;
			TellaVision.intEntryHeight = 80;	
			TellaVision.intEntryWidth = 220;	
			TellaVision.strAlbumArtFolder = "/resources/albumart/"
//			TellaVision.strEntryClass = "clsQueryResultEntry";
			TellaVision.strSearchEntryClass = "cls_search_entry";
			TellaVision.strTarget_Content_Class = "clsQueryResultEntry";

			TellaVision.objTopMenu = $("idPlayerControls");
			TellaVision.objSideMenu = $("dvSideNavigation");
			TellaVision.objWebKeyboard = $("idWebKeyboard");
			TellaVision.objFlashplayer = $("dvPlayer");
			TellaVision.objSystemStatus = $("dvSystemStatus");


			TellaVision.objBodyContainer = $("idBodyContainer");
			TellaVision.objTarget_Content_Container = $("idContentContainer");
			TellaVision.objTarget_Content = $("idQueryResult");
			TellaVision.objPlayerTimer = $("idPlayerTimer");

			TellaVision.objQuerySubMenuContainer = $("dvSideNavigation");
			TellaVision.objQuerySubMenuUser = $("idCurrentUser");
			TellaVision.objQuerySubMenuPlaylist = $("idCurrentPlaylist");
			TellaVision.objQuerySubMenuArtist = $("idCurrentArtist");
			TellaVision.objQuerySubMenuAlbum = $("idCurrentAlbum");
			TellaVision.objQuerySubMenuGenre = $("idCurrentGenre");
			TellaVision.objQuerySubMenuYear = $("idCurrentYear");
			TellaVision.objQuerySubMenu = $("idQuerySubMenu");	

			TellaVision.objSearchTerm = $("dvSearchTerm");
			TellaVision.objVolume = $("idVolTouchLayer");  //idVolume
			TellaVision.objVolumeScroller = $("idVolumeScroller");
			
			
			TellaVision.intScrollSize = TellaVision.objTarget_Content_Container.scrollHeight;
			TellaVision.idxSelected = 1; //idxSearch;
			TellaVision.bUIready = true;
			TellaVision.strKeyString ='';
			TellaVision.fn_initialize()
		}
