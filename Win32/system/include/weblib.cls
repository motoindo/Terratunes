function clsWebLibrary(){
	this.objPopupParent = Object;
	this.objPopUp = Object;
	this.iPopUpWidth = 0;
	this.iPopUpHeight = 0;
	this.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	this.isValidEmailAdress = function(mailids){
		var arr = new Array('.com','.net','.org','.biz','.coop','.info','.museum','.name','.pro'
		,'.edu','.gov','.int','.mil','.ac','.ad','.ae','.af','.ag','.ai','.al',
		'.am','.an','.ao','.aq','.ar','.as','.at','.au','.aw','.az','.ba','.bb',
		'.bd','.be','.bf','.bg','.bh','.bi','.bj','.bm','.bn','.bo','.br','.bs',
		'.bt','.bv','.bw','.by','.bz','.ca','.cc','.cd','.cf','.cg','.ch','.ci',
		'.ck','.cl','.cm','.cn','.co','.cr','.cu','.cv','.cx','.cy','.cz','.de',
		'.dj','.dk','.dm','.do','.dz','.ec','.ee','.eg','.eh','.er','.es','.et',
		'.fi','.fj','.fk','.fm','.fo','.fr','.ga','.gd','.ge','.gf','.gg','.gh',
		'.gi','.gl','.gm','.gn','.gp','.gq','.gr','.gs','.gt','.gu','.gv','.gy',
		'.hk','.hm','.hn','.hr','.ht','.hu','.id','.ie','.il','.im','.in','.io',
		'.iq','.ir','.is','.it','.je','.jm','.jo','.jp','.ke','.kg','.kh','.ki',
		'.km','.kn','.kp','.kr','.kw','.ky','.kz','.la','.lb','.lc','.li','.lk',
		'.lr','.ls','.lt','.lu','.lv','.ly','.ma','.mc','.md','.mg','.mh','.mk',
		'.ml','.mm','.mn','.mo','.mp','.mq','.mr','.ms','.mt','.mu','.mv','.mw',
		'.mx','.my','.mz','.na','.nc','.ne','.nf','.ng','.ni','.nl','.no','.np',
		'.nr','.nu','.nz','.om','.pa','.pe','.pf','.pg','.ph','.pk','.pl','.pm',
		'.pn','.pr','.ps','.pt','.pw','.py','.qa','.re','.ro','.rw','.ru','.sa',
		'.sb','.sc','.sd','.se','.sg','.sh','.si','.sj','.sk','.sl','.sm','.sn',
		'.so','.sr','.st','.sv','.sy','.sz','.tc','.td','.tf','.tg','.th','.tj',
		'.tk','.tm','.tn','.to','.tp','.tr','.tt','.tv','.tw','.tz','.ua','.ug',
		'.uk','.um','.us','.uy','.uz','.va','.vc','.ve','.vg','.vi','.vn','.vu',
		'.ws','.wf','.ye','.yt','.yu','.za','.zm','.zw');
		
		var mai = mailids;
		var val = true;
		var beforeat="";
		var afterat="";
		var afterat2="";
		
		var dot=mai.lastIndexOf(".");
		var con=mai.substring(dot, mai.length);
		con=con.toLowerCase();
		con=con.toString();
		
		for(var i=0;i<(arr.length);i++)
		{
			if(con == arr[i])
			{
				val=true;
				break;
			}
			else
			{
				val=false;
			}
		}
		
		var att=mai.lastIndexOf("@");
		beforeat=mai.substring(0,att);
		beforeat=beforeat.toLowerCase();
		beforeat=beforeat.toString();
		var asci1=beforeat.charCodeAt(0);
		
		afterat=mai.substring(att+1, dot);
		afterat=afterat.toLowerCase();
		afterat=afterat.toString();
		
		afterat2=mai.substring(att+1, mai.length);
		afterat2=afterat2.toLowerCase();
		afterat2=afterat2.toString();
		
		if(beforeat=="" || afterat=="" || beforeat.length>30) val=false;
		if(afterat2.length>64 || afterat.length<2) val=false;
		if((afterat.charCodeAt(0))==45 || (afterat.charCodeAt(afterat.length-1))==45) val=false;
		if(val==true){
			if(asci1 > 47 && asci1 < 58) val=false;
			if(asci1 < 48 || asci1 > 57)
			{
				for(var i=0; i<=beforeat.length-1; i++)
				{
					var asci2=beforeat.charCodeAt(i);
					if((asci2<=44 || asci2==47) || (asci2>=58 && asci2<=94) || (asci2==96) || (asci2>=123 && asci2<=127))
					{
						val=false;
						break;
					}
				}
				
				for(var j=0; j<=afterat.length-1; j++)
				{
					var asci3=afterat.charCodeAt(j);
					if((asci3<=44) || (asci3==46) || (asci3==47) || (asci3>=58 && asci3<=96) || (asci3>=123 && asci3<=127))
					{
						val=false;
						break;
					}
				}	
			}
		}
		return val;
	}		
	this.PopUp = function(sContent){
		with(this)
		{
			//objPopupParent.style.filter = "alpha(opacity=40);-moz-opacity:.30;opacity:.30;"
			objPopUp.style.display = '';
			objPopUp.innerHTML = sContent;
			//TellaVision.WaitMessage("")
		}
	}
	this.fn_cleartimer = function(hTimer){
		if(hTimer != 0) window.clearTimeout(hTimer);
		//delete hTimer;
		return 0
	}
	this.IsNumeric = function(expression){
		return (parseInt(expression) == expression-0) 
	}
	this.PopOff = function (){
			setTimeout("WebLib.PopOffTimer()",1000);
	}	
	this.PopOffTimer = function (){
			//this.objPopupParent.style.filter = "alpha(opacity=100);-moz-opacity:.100;opacity:.100;"
			this.objPopUp.style.display = 'none';
	}	
	this.fn_initialize = function (){
		with(this)
		{
			iPopUpWidth = 260;
			iPopUpHeight = 60;
			objPopUp.style.width = iPopUpWidth;
			objPopUp.style.height = iPopUpHeight;
			objPopUp.style.top = document.body.clientHeight / 2 - (iPopUpHeight/2);
			objPopUp.style.left = document.body.clientWidth /2 - (iPopUpWidth/2);
		}
	}		
	this.isIE = function(){
		if(navigator.userAgent.toLowerCase().indexOf("msie") > -1) return true; else return false;
	}
	this.isFF = function(){
		if(navigator.userAgent.toLowerCase().indexOf("firefox") > -1) return true; else return false;
	}	
	this.GetBit = function(i1,i2){
		return (parseInt(i1) & i2)==i2
	}
	this.SetBit = function(i1,i2){
		if(!((parseInt(i1) & i2)==i2)) return (parseInt(i1) + i2);
		else
		return parseInt(i1)
	}
	this.ResetBit = function(i1,i2){
		if(((i1 & i2)==i2))	return (i1 - i2);
		else
		return i1
	}
	this.ToggleBit = function(i1,i2){
		if((parseInt(i1) & i2)==i2)
		{
			if(((i1 & i2)==i2))	return (i1 - i2);
			else
			return i1
		}
		else
		{
			if(!((parseInt(i1) & i2)==i2)) return (parseInt(i1) + i2);
			else
			return parseInt(i1)
		}
	}	
	this.ConvertTime = function(inVal){
		with(this)
		{
			if(inVal == 0)
				return ""
			else
			{
				var intMinutes = Math.round(inVal/60);
				if((intMinutes * 60) > inVal) intMinutes--;
				var intSeconds = Math.round(inVal - (intMinutes * 60));
				if(intSeconds<10) sSec = "0" + intSeconds; else sSec = intSeconds
				return intMinutes + ":" + sSec
			}
			
		}
	}
	this.ColorChooser = function(){
		with(this)
		{
			sColor = dlgColor.ChooseColorDlg();
			sColor = sColor.toString(16);
			if (sColor.length < 6)
			{
				var sTempString = "000000".substring(0,6-sColor.length);
				sColor = sTempString.concat(sColor);
			}
			return sColor
		}
	}
	this.StripLongNames = function(strIn){
			if(strIn.length > 15)
			{
				 // see if there are spaces within the first 20 chars of the title, if not truncate it to 20
				 bTruncTitle = true;
				 for(y=1;y <=20;y++)
				 {
					if(strIn.slice(y,y+1)==" ") bTruncTitle = false;
				 }
				if(bTruncTitle) strIn = strIn.slice(0,23) + "...";
			}
			return strIn
		}
	/**
*   Gets an event with all needed properties
*   @param      e           event
*   @return     event object
*/
	this.GetEvent = function(e){
		with(this){
			if(!e) e = window.event;
			
			/*
			if(e.layerX)
			{
			e.offsetX       = e.layerX;
			e.offsetY       = e.layerY;
			}
			*/	 
			if(e.type == 'mouseover' && !e.relatedTarget)
			{
			e.relatedTarget     = e.fromElement;
			}
			else if(e.type == 'mouseout' && !e.relatedTarget)
			{
			e.relatedTarget     = e.toElement;
			}
			
			e.src               = e.srcElement || e.target;
			e.key               = e.keyCode || e.charCode;
			
			return e;
		}
	}		
	this.AddEvent = function (object, evt, func, capture){
		with(this){
			if(typeof func != 'function')return false;
			if(object.addEventListener)
			{
				object.addEventListener(evt, func, capture);
				return true;
			}
			else if(object.attachEvent)
			{
				object.attachEvent('on' + evt, func);
				return true;
			}
			return false;
		}		
	}		
	this.RemoveEvent = function (object, evt, func, capture){
		with(this)
		{
			if(typeof func != 'function') return false;
			if(object.removeEventListener)
			{
				object.removeEventListener(evt, func, capture);
				return true;
			}
			else if(object.detachEvent)
			{
				object.detachEvent('on' + evt, func);
				return true;
			}
			return false;
		}
	}
	this.DeSpace = function(strIn){
		with(this)
		{
		return strIn.replace(/ /g, '');
		}
	}
	/* ---------------------------------------------------------------------- *\
		  Function    : _dec_to_rgb
		  Description : convert a decimal color value to rgb hexadecimal
		  Usage       : var hex = _dec_to_rgb('65535');   // returns FFFF00
		  Arguments   : value   - dec value
		\* ---------------------------------------------------------------------- */
	this._dec_to_rgb = function (value){
		with(this)
		{
			var hex_string = "";
			for (var hexpair = 0; hexpair < 3; hexpair++) 
			{
				var myByte = value & 0xFF;            // get low byte
				value >>= 8;                          // drop low byte
				var nybble2 = myByte & 0x0F;          // get low nybble (4 bits)
				var nybble1 = (myByte >> 4) & 0x0F;   // get high nybble
				hex_string += nybble1.toString(16);   // convert nybble to hex
				hex_string += nybble2.toString(16);   // convert nybble to hex
			}
			return hex_string.toUpperCase();
		}
	}
	this.GetIdString = function(intProcID){
		with (this)
		{
			switch(intProcID)
			{
				case type_artist : return "type_artist"; break
				case type_album  : return "type_album"; break
				case type_song : return "type_song"; break				
				case type_playlist : return "type_playlist"; break
				case type_playlist_song : return "type_playlist_song"; break
				case type_genre : return "type_genre"; break
				case type_date : return "type_date"; break			
				case type_family : return "type_family";break
				case type_year : return "type_year";break
				//case type_user : return "type_user"; break
				case type_void : return "type_void"; break
				case mouse_left			: return "mouse_left";break
				case mouse_left_sticky	: return "mouse_left_sticky";break
				case mouse_wheel		: return "mouse_wheel";break
				case mouse_wheel_sticky	: return "mouse_wheel_sticky";break
				case mouse_right		: return "mouse_right";break
				case mouse_right_sticky	: return "mouse_right_sticky";break
				case mouse_over 		: return "mouse_over";break
				case mouse_out	 		: return "mouse_out";break
				case mouse_up 			: return "mouse_up";break
				case mouse_down 		: return "mouse_down";break
				case mouse_dblclick 	: return "mouse_dblclick";break
				case mouse_move 		: return "mouse_move";break
				case db_update_song : return "db_update_song";break
				case db_update_artist : return "db_update_artist";break
				case db_update_album : return "db_update_album";break
				case db_remove_artist : return "db_remove_artist";break
				case db_remove_album : return "db_remove_album";break
				case db_remove_song : return "db_remove_song";break
				case db_cleanup_songs : return "db_cleanup_songs";break
				case db_item_details : return "db_item_details";break
				case db_system_status : return "db_system_status";break
				case db_system_xmlready : return "db_system_xmlready";break
				case type_webpage : return "type_webpage"; break
				case type_webpage_topmenu : return "type_webpage_topmenu"; break
				case type_webpage_sidemenu : return "type_webpage_sidemenu"; break
				case type_webpage_home : return "type_webpage_home"; break
				case db_search : return "db_search"; break
				case media_all : return "media_all"; break
				case db_piratelogic_listservers: return "db_piratelogic_listservers"; break
				case db_piratelogic_transcode: return "db_piratelogic_transcode"; break
				
				
				
				case db_browse_page: return "db_browse_page"; break
				case db_browse_history : return "db_browse_history"; break
				case db_browse_history_selection : return "db_browse_history_selection"; break
				case db_browse_year : return "db_browse_year"; break
				case db_browse_artist_songs : return "db_browse_artist_songs"; break
				case db_browse_artist_albums : return "db_browse_artist_albums"; break
				case db_browse_artist_albums_va : return "db_browse_artist_albums_va"; break
				case db_browse_album_songs : return "db_browse_album_songs"; break
				case db_browse_album_songs_artist : return "db_browse_album_songs_artist"; break
				case db_browse_song_year : return "db_browse_song_year"; break
				case db_browse_album_artists : return "db_browse_album_artists"; break
				case db_browse_genre : return "db_browse_genre"; break
				case db_browse_genre_artists : return "db_browse_genre_artists"; break
				case db_browse_genre_albums : return "db_browse_genre_albums"; break
				case db_browse_genre_songs : return "db_browse_genre_songs"; break
				case db_playlist_list : return "db_playlist_list"; break
				case db_playlist_list_artists : return "db_playlist_list_artists"; break
				case db_playlist_list_albums : return "db_playlist_list_albums"; break
				case db_playlist_list_songs : return "db_playlist_list_songs"; break
				case db_playlist_list_add : return "db_playlist_list_add"; break
				case db_playlist_list_delete : return "db_playlist_list_delete"; break
				case db_playlist_list_song_add : return "db_playlist_list_song_add"; break
				case db_playlist_list_song_delete : return "db_playlist_list_song_delete"; break
				case db_playlist_list_update : return "db_playlist_list_update"; break
				case db_playlist_list_default  : return "db_playlist_list_default"; break
				case db_playlist_save_sortorder  : return "db_playlist_save_sortorder"; break
				case player_stop  : return "player_stop"; break
				case player_pause  : return "player_pause"; break
				case player_playing  : return "player_playing"; break
				case player_scanforward  : return "player_scanforward"; break
				case player_scanreverse  : return "player_scanreverse"; break
				case player_buffering  : return "player_buffering"; break
				case player_waiting  : return "player_waiting"; break
				case player_mediaended  : return "player_mediaended"; break
				case player_transitioning  : return "player_transitioning"; break
				case player_ready  : return "player_ready"; break
				case player_reconnecting  : return "player_reconnecting"; break
				case player_start  : return "player_start"; break
				case player_resume  : return "player_resume"; break
				case player_previous  : return "player_previous"; break
				case player_next  : return "player_next"; break
				case player_video  : return "player_video"; break
				case player_preview : return "player_preview"; break
				case priv_guest : return "guest";break
				case priv_user : return "user";break
				case priv_family : return "family";break
				case priv_owner : return "owner";break
				case db_browse_page : return "db_browse_page";break

				case db_webtree_topic_add : return "db_webtree_topic_add";break
				case db_webtree_topic_move : return "db_webtree_topic_move";break
				case db_webtree_topic_sort : return "db_webtree_topic_sort";break
				case db_webtree_topic_delete : return "db_webtree_topic_delete";break		
				case db_webtree_topic_get : return "db_webtree_topic_get";break
				case db_webtree_topic_update : return "db_webtree_topic_update";break
				case db_webtree_topic_children : return "db_webtree_topic_children";break		



				case db_piratelogic_register: return "db_piratelogic_register";break		
				
				default : alert("WebLib.GetIdString:Unknown(" + intProcID + ")");
			}
		}
	}
	/* This code was written by Tyler Akins and has been placed in the
 		public domain.  It would be nice if you left this header intact.
		base64 code from Tyler Akins -- http://rumkin.com */
	this.encode64 = function(input){
		with(this)
		{
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			
			do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			
			if (isNaN(chr2)) {
			enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
			enc4 = 64;
			}
			
			output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + 
			keyStr.charAt(enc3) + keyStr.charAt(enc4);
			} while (i < input.length);
			
			return output;
		}
	}
	this.decode64 = function(input){
		with(this)
		{
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			do {
			enc1 = keyStr.indexOf(input.charAt(i++));
			enc2 = keyStr.indexOf(input.charAt(i++));
			enc3 = keyStr.indexOf(input.charAt(i++));
			enc4 = keyStr.indexOf(input.charAt(i++));
			
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			
			output = output + String.fromCharCode(chr1);
			
			if (enc3 != 64) {
			output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
			output = output + String.fromCharCode(chr3);
			}
			} while (i < input.length);
			return output;
		}
	}
	this.iebody = function(){
    // Sense the difference between Strict and Quirks mode
    	with(this){return (document.compatMode != "BackCompat"? document.documentElement : document.body)}
	}
	this.D2H = function(intVal){
		var sOut = intVal.toString(16)
		if(sOut.length == 1) sOut = '0' + sOut;
		return sOut.toUpperCase();	
		
	}
	this.MonthName = function(intMonth){
		switch(intMonth)
		{
			case 1: return "Januari";
			case 2: return "Februari";
			case 3: return "Maart";
			case 4: return "April";
			case 5: return "Mei";
			case 6: return "Juni";
			case 7: return "Juli";
			case 8: return "Augustus";
			case 9: return "September";
			case 10: return "Oktober";
			case 11: return "November";
			case 12: return "December";
		}
	}
	this.DayName = function(intDay){
		switch(intDay)
		{
			case 1: return "Maandag";
			case 2: return "Dinsdag";
			case 3: return "Woensdag";
			case 4: return "Donderdag";
			case 5: return "Vrijdag";
			case 6: return "Zaterdag";
			case 7: return "Zondag";
		}
	}
	this.addClass = function(element, elClass) {
		var curr = element.className;
		if (!new RegExp(("(^|\\s)" + elClass + "(\\s|$)"), "i").test(curr)) {
			element.className = curr + ((curr.length > 0) ? " " : "") + elClass;
		}
		return element;
	}

	this.removeClass = function(element, elClass) {
		if (elClass) {
			element.className = element.className.replace(elClass, "");
		} else {
			element.className = "";
			element.removeAttribute("class");
		}
		return element;
	}
	this.setbutton = function(idBtn,sCaption,iAction,sClass,bHide){
		idBtn.setAttribute("IDA", iAction);
		idBtn.innerHTML = sCaption;
		if(sClass) idBtn.className = sClass;
		idBtn.style.display = (bHide) ? "none" : ""	
	}
}
	