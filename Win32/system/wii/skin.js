	var Language = new clsLanguage();
	var Settings = new clsSettings();				//	contains all by server populated application settings
	var WL = new clsWebLibrary();			//	generic function library
	var DataCommand = new clsDbCommand();		//	database ajax layer
	var FlashPlayer = new clsFlashPlayer();	
	
	
	
	FlashPlayer.fn_initialize('dvPlayer','600','20')