	function clsTellaVision(){
		/**********************************************************************************************************************************************************
		*** control vars  ****************************************************************************************************************************************
		**********************************************************************************************************************************************************/
		strDateSelection = '0:0:0';
		this.hfn_selectpage = 0;
		this.iTimes = 1; // used with page nav to allow quick fw/rwd
		this.bConsoleMode = false;
		this.intServerVolume = 0;
		this.strSearchString = '';
		this.intFingerStartPosition_X = 0;			// set on mousedown, determines finger y startposition
		this.intFingerStartPosition_Y = 0;			// set on mousedown, determines finger y startposition
		this.intFingerEndPosition_X = 0;			// set on mouseup, determines finger y  endposition
		this.intFingerEndPosition_Y = 0;			// set on mouseup, determines finger y  endposition
		this.intSwipeWindowWidth = 320;
		this.hServerTimer = 0;
		this.bPerformClick = false;
		this.intEntryHeight = 48;					// height of artist, album, song etc entry, used with -webkit-transition-property
		this.intEntryWidth = 64;					// height of artist, album, song etc entry, used with -webkit-transition-property
		this.strClassColor = "";
		this.bKeyClick = false;
		this.bValidTouch = true;
		this.intFingerTreshold_X = 120;
		this.intFingerTreshold_Y = 40;
		this.objBody = new Object;
		this.objBodyContainerLandscape = new Object;
		this.objBodyContainerPortrait = new Object;
//		this.objSplash = new Object;
//		this.objSplashMessage = new Object;
		this.objQTplayer = new Object;
		this.objPlayerDiv = document.createElement('div');
		this.objQTnext = new Object
		this.hfn_volumedisplay = 0;
		this.volEntryWidth = 39;

		/**********************************************************************************************************************************************************
		*** titlebar  *********************************************************************************************************************************************
		**********************************************************************************************************************************************************/
		this.o_titlebar = new Object;
		/**********************************************************************************************************************************************************
		*** topmenu  *********************************************************************************************************************************************
		**********************************************************************************************************************************************************/
		this.objHeaderMenu = new Object;
		this.arrMenuButtons	= new Array();
		this.objHeaderMenuSwipeDiv	 = new Object;
		this.arrMainButtons = new Array();
		this.objHeaderMenu_PlayerState = new Object;
		this.objHeaderMenu_PlayerStop = new Object;
		this.objPlayer_VolumeSwipe = new Object;
		this.objPlayer_VolumeSwipeBox = new Object;
		this.objPlayer_VolumeMute = new Object;
		this.objPlayer_VolumeMax = new Object;
		/**********************************************************************************************************************************************************
		/*** keyboard *********************************************************************************************************************************************
		/**********************************************************************************************************************************************************/
		this.objFilter = new Object;
		this.objMessageContainer		= new Object;
		/**********************************************************************************************************************************************************
		/*** result panes  ****************************************************************************************************************************************
		/**********************************************************************************************************************************************************/
		this.objResult = new Object;
		this.oTouchTarget = new Object;
		/**********************************************************************************************************************************************************
		/*** footer ***********************************************************************************************************************************************
		/**********************************************************************************************************************************************************/
		this.objFooterMenu 				= new Object;
		this.objFooterSwipeDiv	 		= new Object;
		this.arrFooterButtons			= new Array();
		/**********************************************************************************************************************************************************
		/*** common code snippets *********************************************************************************************************************************
		/**********************************************************************************************************************************************************/
		this.fn_busy = function(bBusy,sMsg){
			with(this){
				uistate = (bBusy) ? WL.SetBit(uistate,uistate_splash) : WL.ResetBit(uistate,uistate_splash)
				fn_uistate_update();
				//if(sMsg) objSplashMessage.innerHTML = sMsg
			}
		}
		this.fn_infopane = function(sMsg){
			this.fn_resultselector().innerHTML = sMsg;
		}
		this.fn_buttonhandler = function(event,touchmode){
			var touch = event.changedTouches[0]; // Get the information for finger #1
			var btn  = touch.target;
			with(this){
				switch(btn){
					case objFilter.Genre:
					case objFilter.Year:				
					case objMessageContainer.Chatbox:					
					case objMessageContainer.Inputbox:					;break
					default:
						// get to the DIV element
						while((btn.tagName != 'DIV') && (btn != objFooterMenu) && (btn != objHeaderMenu)) btn = btn.parentElement;
						var parentpane = btn.parentElement;
						event.preventDefault()
						switch(touchmode){
							case "touchend":
								if(bPerformClick){
									// get to the div containing IDA
									while((btn.getAttribute("IDA") == null) && (btn != parentpane)) btn = btn.parentElement;
									// get the IDA value, if it's not there igore the touch all together
									var IDA = (btn.getAttribute("IDA") == null) ? -1 : parseInt(btn.getAttribute("IDA"));
									if(IDA !=-1){
										if(parentpane == objHeaderMenuSwipeDiv) for(x=0;x<4;x++) WL.removeClass(arrMenuButtons[x],"clsHeaderButtonSelected");
										switch(IDA){
											case uistate_searchmode:
												// just incase .. reset selectmode
												uistate = WL.ResetBit(uistate,uistate_select);
												// toggle search menu
												if(WL.GetBit(uistate,uistate_searchmode)){
													uistate = WL.SetBit(uistate,uistate_message_chatbox);
													uistate = WL.ResetBit(uistate,uistate_message_inputbox);
													uistate = WL.ResetBit(uistate,uistate_message_execute);
													uistate = WL.ResetBit(uistate,uistate_searchmode);
													fn_page_status(fn_currentmedia())
												}else{
													uistate = WL.ResetBit(uistate,uistate_message_chatbox);
													uistate = WL.SetBit(uistate,uistate_message_inputbox);
													uistate = WL.SetBit(uistate,uistate_searchmode);
													uistate = WL.ResetBit(uistate,uistate_playlist);
													uistate = WL.ResetBit(uistate,uistate_history);
													uistate = WL.ResetBit(uistate,uistate_family);
													// allways display context menu when in searchmode
													objFooterSwipeDiv.style.left = "-" + (intSwipeWindowWidth) + "px";
													uistate = WL.SetBit(uistate,uistate_message_execute);
													btn = WL.addClass(btn,"clsHeaderButtonSelected");
													fn_resultselector(DataCommand.Control.SearchType); 
													fn_page_status();
												}
												fn_footermenu(IDA)
												break											
											case uistate_playlist:
												// just incase .. reset selectmode
												uistate = WL.ResetBit(uistate,uistate_select);
												if(WL.GetBit(uistate,uistate_playlist)){
//													deactivate playlist 
													uistate = WL.ResetBit(uistate,uistate_playlist);
													fn_resultselector(DataCommand.Control.SearchType); 
													fn_footermenu(DataCommand.Control.SearchType);
													fn_page_status();
												}else{
													uistate = WL.ResetBit(uistate,uistate_searchmode);
													uistate = WL.SetBit(uistate,uistate_playlist);
													uistate = WL.ResetBit(uistate,uistate_history);
													uistate = WL.ResetBit(uistate,uistate_family);
													WL.addClass(btn,"clsHeaderButtonSelected");
//													if(DataCommand.PageInfo[type_playlist].Current.intID == 0){
//														fn_page_status(Language.playlists_choose);
//														fn_resultselector(type_playlist);
//													}else{
														fn_resultselector(type_playlist_song);
														fn_page_status(fn_currentmedia())
//													}
													fn_footermenu(IDA)
												}
												break
											case uistate_history:
												// just incase .. reset selectmode
												uistate = WL.ResetBit(uistate,uistate_select);
												if(WL.GetBit(uistate,uistate_history)){
													uistate = WL.ResetBit(uistate,uistate_history);
													fn_resultselector(DataCommand.Control.SearchType); 
													fn_footermenu(DataCommand.Control.SearchType);
													fn_page_status();													
												}else{
													uistate = WL.ResetBit(uistate,uistate_searchmode);
													uistate = WL.ResetBit(uistate,uistate_playlist);
													uistate = WL.SetBit(uistate,uistate_history);
													uistate = WL.ResetBit(uistate,uistate_family);
													WL.addClass(btn,"clsHeaderButtonSelected")
													fn_page_status("Kies een periode beneden.")
													fn_footermenu(IDA)
												}
												break
											case uistate_family:
												// just incase .. reset selectmode
												uistate = WL.ResetBit(uistate,uistate_select);
												if(WL.GetBit(uistate,uistate_family)){
													uistate = WL.ResetBit(uistate,uistate_family);
												}else{
													uistate = WL.ResetBit(uistate,uistate_searchmode);
													uistate = WL.ResetBit(uistate,uistate_playlist);
													uistate = WL.ResetBit(uistate,uistate_history);
													uistate = WL.SetBit(uistate,uistate_family);
													fn_resultselector(type_family);
													WL.addClass(btn,"clsHeaderButtonSelected");
												}
												fn_footermenu(IDA)
												break
											case uicmd_submit:
												uistate = WL.SetBit(uistate,uistate_footer);
												// take appropriate action depending on uistate
												if(WL.GetBit(uistate,uistate_searchmode)){
													strSearchString = objMessageContainer.Inputbox.value
													fn_execute("fn_displayresults(db_search,TellaVision.strSearchString)");
													uistate = WL.SetBit(uistate,uistate_message_chatbox);
													uistate = WL.ResetBit(uistate,uistate_message_inputbox);
													uistate = WL.ResetBit(uistate,uistate_message_execute);
												}
												if(WL.GetBit(uistate,uistate_playlist_delete)){
													uistate = WL.ResetBit(uistate,uistate_playlist_delete);
													//uistate = WL.ResetBit(uistate,uistate_keyboard);
													fn_execute("fn_displayresults(db_playlist_list_delete)")
												}
												if(WL.GetBit(uistate,uistate_playlist_update)){
													uistate = WL.ResetBit(uistate,uistate_playlist_update);
													//uistate = WL.ResetBit(uistate,uistate_keyboard);
													DataCommand.PageInfo[type_playlist].Selected.strTitle = objMessageContainer.Inputbox.value;
													fn_execute("fn_displayresults(db_playlist_list_update)")
												}
												if(WL.GetBit(uistate,uistate_playlist_new)){
													uistate = WL.ResetBit(uistate,uistate_playlist_new);
													//uistate = WL.ResetBit(uistate,uistate_keyboard);
													DataCommand.PageInfo[type_playlist].Selected.strTitle = objMessageContainer.Inputbox.value;
													fn_execute("fn_displayresults(db_playlist_list_add)")
												}
												//uistate = WL.SetBit(uistate,uistate_results);
												//uistate = WL.SetBit(uistate,uistate_footer);
												break
											case db_search_clear: 
												strSearchString = "";
												objMessageContainer.Inputbox.value = "";
												break
											case uicmd_refresh:	location.reload();break
											case uistate_remote:	
												if(WL.GetBit(uistate,uistate_remote)){
													// TODO: need to add code to clean any existing recordsets before switching from stream 
													//  to remote to avoid trying to play songs that don't yet live in de servers console db
													fn_setbutton(arrMainButtons[3],"remote<br>mode",uistate_remote)
													uistate = WL.ResetBit(uistate,uistate_remote)
												}else{
													fn_setbutton(arrMainButtons[3],"stream<br>mode",uistate_remote)
													uistate = WL.SetBit(uistate,uistate_remote);
												}		
												break
											case db_player_stop:
											case db_player_start:
											case db_player_pause:
											case db_player_resume:
													DataCommand.fn_dbexec(0,IDA);
													fn_setmediaplayerbuttons(IDA);
													break
											case uistate_select:
												if(WL.GetBit(uistate,uistate_select)){
													switch(DataCommand.Control.ClientTypeID){
														case type_artist:	fn_execute("fn_displayresults(db_playlist_list_artist_add)");break
														case type_album:	fn_execute("fn_displayresults(db_playlist_list_album_add)");break
														case type_song:		fn_execute("fn_displayresults(db_playlist_list_song_add)");break
													}
													uistate = WL.ResetBit(uistate,uistate_select);
													fn_footermenu(DataCommand.Control.ClientTypeID);
												}else{
													switch(DataCommand.Control.ClientTypeID){
														case type_artist:
														case type_album:
														case type_song:	
																uistate = WL.SetBit(uistate,uistate_select);
																fn_footermenu(DataCommand.Control.SearchType);
/*
																if(DataCommand.PageInfo[type_playlist].Current.intID !=0){
																	uistate = WL.SetBit(uistate,uistate_select);
																	fn_footermenu(DataCommand.Control.SearchType);
																}else{
																	alert(Language.info_nochosenplaylist);
																}
*/
																break
														case type_playlist_song:
																uistate = WL.SetBit(uistate,uistate_select);
																fn_footermenu(DataCommand.Control.ClientTypeID);
																break
														case type_playlist:
																uistate = WL.SetBit(uistate,uistate_select);
																fn_footermenu(DataCommand.Control.ClientTypeID);
																break
													}
												}
						//						fn_page_status("CT:ui_sel = " + DataCommand.Control.ClientTypeID + ":" + WL.GetBit(uistate,uistate_select) );
												break
											case media_flac:
											case media_mp3:
											case media_grps:
											case media_all:
												switch(DataCommand.intMediaQuality){
													case media_flac:	DataCommand.intMediaQuality = media_grps;
																		fn_setbutton(btn,Language.media_grps,media_grps,"clsKeyBtnRed");
																		break
													case media_mp3:		DataCommand.intMediaQuality = media_flac;
																		fn_setbutton(btn,Language.media_flac,media_flac,"clsKeyBtnGreen");
																		break
													case media_grps:	DataCommand.intMediaQuality = media_all;
																		fn_setbutton(btn,Language.media_all,media_all,"clsKeyBtn");
																		WL.removeClass(btn,"clsKeyBtnGreen");
																		break
													case media_all:		DataCommand.intMediaQuality = media_mp3;
																		fn_setbutton(btn,Language.media_mp3,media_mp3,"clsKeyBtnBlue");
																		break
												}
												// only update searchmessage if in searchmode
												if(WL.GetBit(uistate,uistate_searchmode)) fn_page_status();
												break
											case duration_short:
											case duration_medium:
											case duration_long:
												switch(DataCommand.intSearchLength){
													case duration_short:	DataCommand.intSearchLength = duration_medium;
																			fn_setbutton(btn,"song",duration_medium,"clsKeyBtnGreen");
																			break
													case duration_medium:	DataCommand.intSearchLength = duration_long;
																			fn_setbutton(btn,"mix",duration_long,"clsKeyBtnGreen");
																			break
													case duration_long:		DataCommand.intSearchLength = duration_short;
																			fn_setbutton(btn,"clip",duration_short,"clsKeyBtnGreen");
																			break
												}
												// only update searchmessage if in searchmode
												if(WL.GetBit(uistate,uistate_searchmode)) fn_page_status();
												break
											case search_targeting_begin:
											case search_targeting_loose:
											case search_targeting_exact:
												switch(IDA){
													case search_targeting_begin:
														DataCommand.intSearchMode = search_targeting_exact;
														fn_setbutton(btn,Language.search_targeting_exact,search_targeting_exact)
														break
													case search_targeting_loose:
														DataCommand.intSearchMode = search_targeting_begin;
														fn_setbutton(btn,Language.search_targeting_begin,search_targeting_begin)
														break
													case search_targeting_exact:
														DataCommand.intSearchMode = search_targeting_loose;
														fn_setbutton(btn,Language.search_targeting_loose,search_targeting_loose)
														break
												}
												// only update searchmessage if in searchmode
												if(WL.GetBit(uistate,uistate_searchmode)) fn_page_status();
												break
											case type_playlist :
											case type_playlist_song:		  	fn_resultselector(IDA);
																				fn_page_status(fn_currentmedia())
//																				fn_uistate_update();
																				break
											case uicmd_context:					objFooterSwipeDiv.style.left = "-" + (intSwipeWindowWidth) + "px";
																				break // fn_setfootermenu();
											case db_browse_firstpage:
											case db_browse_previouspage:
											case db_browse_nextpage:
											case db_browse_lastpage:			fn_selectpage(IDA);break
											case db_browse_artist_songs:		fn_execute("fn_displayresults(db_browse_artist_songs,'')");	break
											case db_browse_artist_albums_va:	fn_execute("fn_displayresults(db_browse_artist_albums_va,'')");break
											case db_browse_artist_albums:		fn_execute("fn_displayresults(db_browse_artist_albums,'')");break
											case db_browse_album_songs:			fn_execute("fn_displayresults(db_browse_album_songs,'')");break

											case db_playlist_list:				fn_execute("fn_displayresults(db_playlist_list)");break
											case db_playlist_list_add:			uistate = WL.SetBit(uistate,uistate_playlist_new);break
											case db_playlist_list_delete:		uistate = WL.SetBit(uistate,uistate_playlist_delete);break
											case db_playlist_list_update:		uistate = WL.SetBit(uistate,uistate_playlist_update);break
											case db_playlist_list_artists:		fn_execute("fn_displayresults(db_playlist_list_artists,'')");break
											case db_playlist_list_artist_add:	fn_execute("fn_displayresults(db_playlist_list_artist_add)");break
											case db_playlist_list_artist_delete:fn_execute("fn_displayresults(db_playlist_list_artist_delete)");break
											case db_playlist_list_albums:		fn_execute("fn_displayresults(db_playlist_list_albums,'')");break
											case db_playlist_list_album_add:	fn_execute("fn_displayresults(db_playlist_list_album_add)");break
											case db_playlist_list_album_delete:	fn_execute("fn_displayresults(db_playlist_list_album_delete)");break
											case db_playlist_list_songs:		fn_execute("fn_displayresults(db_playlist_list_songs,'')");break
											case db_playlist_list_song_add:		fn_execute("fn_displayresults(db_playlist_list_song_add)");break
											case db_playlist_list_song_delete:	fn_execute("fn_displayresults(db_playlist_list_song_delete)");break
											case db_playlist_save_sortorder:	fn_execute("fn_displayresults(db_playlist_save_sortorder)");break
											case db_playlist_list_clear:		fn_execute("fn_displayresults(db_playlist_list_clear)");break
											case list_moveup:					fn_execute("fn_displayresults(list_moveup)");break
											case list_movedown:					fn_execute("fn_displayresults(list_movedown)");break
											case db_browse_history_today:		fn_execute("fn_displayresults(db_browse_history_selection,'0:0:0')");
																				fn_page_status("vandaag beluisterd");
																				break
											case db_browse_history_yesterday:	fn_execute("fn_displayresults(db_browse_history_selection,'1:0:0')");
																				fn_page_status("gisteren beluisterd");
																				break
											case db_browse_history_week:		fn_execute("fn_displayresults(db_browse_history_selection,'7:0:0')");
																				break
											case db_browse_history_month:		fn_execute("fn_displayresults(db_browse_history_selection,'31:0:0')");
																				break
											case db_browse_history_selection:	fn_execute("fn_displayresults(db_browse_history,'')");
																				break
											case family_invite:					fn_infopane("Uw code is fietstas");break
											case family_list:					fn_execute("fn_displayresults(family_list,'')");
																				fn_page_status(Language.family_loading);
																				break
											default:							fn_page_status("fn_buttonhandler: unhandled (" + IDA + ")");
										}
										fn_uistate_update()
									}
								}else{
									// calculate left or right slide
									if(intFingerEndPosition_X < intFingerStartPosition_X)
										// slide right
										switch(parentpane.style.left){
											case "0px" : parentpane.style.left = "-" + intSwipeWindowWidth + "px";break
											//case "-" + intSwipeWindowWidth + "px" : parentpane.style.left = "-" + (2 * intSwipeWindowWidth) + "px";break
										}
									else
										// slide left
										switch(parentpane.style.left){
											//case "-" + (2 * intSwipeWindowWidth) + "px" : parentpane.style.left = "-" + intSwipeWindowWidth + "px";break
											case "-" + intSwipeWindowWidth + "px" : parentpane.style.left = "0px";break
										}
								}
							case "touchmove":
								// set swipe
								intFingerEndPosition_X = parseInt(touch.clientX);
								// if within touch delta reset click handler
								bPerformClick = (Math.abs(intFingerStartPosition_X - intFingerEndPosition_X) < 30)
								break
							case "touchstart":
								//	tell datacommand to holdoff any ajax queries
								DataCommand.bSysBusy = true
								// store finger start positions
								intFingerStartPosition_X = parseInt(touch.clientX);
								// set click handler
								bPerformClick = true;
								break
						}
				}
			}
		}
		this.fn_createcontainer = function(strType,strText,strCls){
			var objElement = document.createElement(strType);
			if(strCls) objElement.className = strCls;
			if(strText) objElement.innerHTML = strText;
			return objElement;
		}
		this.fn_create_content = function(recData){
			with(this){
				var listElement = new function(){
					var tmpSource = "";
					var tmpTarget = "";
					var objSource = Object;
					var objTarget = Object;
					var newObject = document.createElement("DIV");
					newObject.moveUp = function(){
						if(newObject.previousSibling != undefined){
							//	store source
							tmpSource = newObject.innerHTML;
							newObject.getProperties();
							objSource = DataCommand.PageInfo[DataCommand.Control.ClientTypeID].Selected.clone();
							// store target
							tmpTarget = newObject.previousSibling.innerHTML;
							newObject.previousSibling.getProperties();
							objTarget = DataCommand.PageInfo[DataCommand.Control.ClientTypeID].Selected.clone();
							// swap target
							newObject.previousSibling.innerHTML = tmpSource
							newObject.previousSibling.setProperties(objSource)
							// swap source
							newObject.innerHTML = tmpTarget
							newObject.setProperties(objTarget)
						}
					}
					newObject.moveDown = function(recData){
						if(newObject.nextSibling != undefined){
							//	store source
							tmpSource = newObject.innerHTML;
							newObject.getProperties();
							objSource = DataCommand.PageInfo[DataCommand.Control.ClientTypeID].Selected.clone();
							// store target
							tmpTarget = newObject.nextSibling.innerHTML;
							newObject.nextSibling.getProperties();
							objTarget = DataCommand.PageInfo[DataCommand.Control.ClientTypeID].Selected.clone();
							// swap target
							newObject.nextSibling.innerHTML = tmpSource
							newObject.nextSibling.setProperties(objSource)
							// swap source
							newObject.innerHTML = tmpTarget
							newObject.setProperties(objTarget)
							}
					}
					newObject.setProperties = function(recData){
								newObject.className = "cls_" + WL.GetIdString(recData.intTypeID) + ((bConsoleMode) ? "":" Normal");
								if(WL.GetBit(recData.intStatus,status_selected)){
									newObject.className = "cls_" + WL.GetIdString(recData.intTypeID) + ((bConsoleMode) ? "_selected":" Selected");
									// update pageinfo struct
									DataCommand.PageInfo[recData.intTypeID].oSelected = newObject
								}
								if(WL.GetBit(recData.intStatus,status_current)){
									newObject.className = "cls_"+ WL.GetIdString(recData.intTypeID) + ((bConsoleMode) ? "_current":" Current");
									// update pageinfo struct
									DataCommand.PageInfo[recData.intTypeID].oCurrent = newObject
								}
								switch(recData.intTypeID){ //intColType
									case type_song:
									case type_playlist_song:	newObject.setAttribute("IDX", recData.intStatus + ":" + recData.intColIdx + ":" + recData.intTypeID + ":" + recData.intID + ":" + recData.intServerID + ":" + recData.intArtistID + ":" + recData.lngForeignID + ":" + recData.intBitRate + ":" + recData.intMediaQuality);	break
									//case type_user:				break
									case type_playlist:
									case type_artist:			newObject.setAttribute("IDX", recData.intStatus + ":" + recData.intColIdx + ":" + recData.intTypeID + ":" + recData.intID + ":0:0");
																break
									case type_album:			newObject.setAttribute("IDX", recData.intStatus + ":" + recData.intColIdx + ":" + recData.intTypeID + ":" + recData.intID + ":" + recData.intArtistID + ":0");break
									case type_date:				newObject.setAttribute("IDX", recData.intStatus + ":" + recData.intColIdx + ":" + recData.intTypeID + ":" + recData.intDay + ":" + recData.intMonth + ":" + recData.intYear);break
									case type_void:				newObject.setAttribute("IDX", "0:0:" + recData.intTypeID);break
								}
							}
					newObject.getProperties = function(){with(DataCommand){
								// populates the pageinfo array with the ID's properties
								var arr_idx = newObject.getAttribute("IDX").split(":")
								var ArtistID = 0;
								Control.ClientTypeID = parseInt(arr_idx[2]);
								// ignore type_void types
								if(Control.ClientTypeID != type_void){
									with(PageInfo[Control.ClientTypeID].Selected){
										intTypeID = Control.ClientTypeID
										intStatus = parseInt(arr_idx[0]);
										intColIdx = parseInt(arr_idx[1]);
										intID = parseInt(arr_idx[3]);
									}
									switch(Control.ClientTypeID){
										case type_playlist: PageInfo[type_playlist].Selected.strTitle = newObject.childNodes(0).innerHTML;break
										case type_artist:
											PageInfo[type_artist].Selected.strArtist = newObject.childNodes(0).innerHTML;
											PageInfo[type_song].Selected.strArtist = PageInfo[type_artist].Selected.strArtist;
											PageInfo[type_song].Selected.intArtistID = PageInfo[type_artist].Selected.intID;
											break
										case type_album:
											ArtistID = parseInt(arr_idx[4])
											PageInfo[type_album].Selected.intArtistID = ArtistID
											PageInfo[type_album].Selected.strAlbum = newObject.childNodes(0).innerHTML;
											// only update artistid for non VA albums
											if(ArtistID !=0) PageInfo[type_artist].Selected.intID = ArtistID
											PageInfo[type_song].Selected.strAlbum = PageInfo[type_album].Selected.strAlbum;
											break
										case type_song:
										case type_playlist_song:
											with(PageInfo[Control.ClientTypeID].Selected){
												intServerID = parseInt(arr_idx[4]);
												intArtistID = parseInt(arr_idx[5]);
												lngForeignID = parseInt(arr_idx[6]);
												intMediaQuality = parseInt(arr_idx[8]);
												strSong = newObject.childNodes(0).innerHTML;
												strArtist = newObject.childNodes(2).innerHTML;
											}
											PageInfo[type_artist].Selected.strArtist = PageInfo[Control.ClientTypeID].Selected.strArtist;
											PageInfo[type_artist].Selected.intID = PageInfo[Control.ClientTypeID].Selected.intArtistID;
											break
//										case type_family:	PageInfo[type_family].Selected.strYear = newObject.childNodes(0).innerHTML;break
										case type_date:		PageInfo[type_date].Selected.strYear = newObject.childNodes(0).innerHTML;break
//										case type_genre:	PageInfo[type_genre].Selected.strGenre = newObject.childNodes(0).innerHTML;break
										case type_void:		alert("error: type_void");
									}
								}
								return true
							}
						}
					newObject.Select = function(){with(DataCommand){
								// set status flag
								PageInfo[Control.ClientTypeID].Selected.intStatus = WL.SetBit(PageInfo[Control.ClientTypeID].Selected.intStatus,status_selected);
								// update idx property holder
								newObject.setProperties(PageInfo[Control.ClientTypeID].Selected);
								// store as selected object
								PageInfo[Control.ClientTypeID].oSelected = newObject;
							}
						}
					newObject.deSelect = function(){with(DataCommand){
								// reset selected flag on entry
								PageInfo[Control.ClientTypeID].Selected.intStatus = WL.ResetBit(PageInfo[Control.ClientTypeID].Selected.intStatus,status_selected);
								// update idx property holder
								newObject.setProperties(PageInfo[Control.ClientTypeID].Selected);
								// store as selected object
								PageInfo[Control.ClientTypeID].oSelected = null;
							}
						}
					newObject.Toggle = function(){with(DataCommand){
								// toggle selected flag
								PageInfo[Control.ClientTypeID].Selected.intStatus = (WL.GetBit(PageInfo[Control.ClientTypeID].Selected.intStatus,status_selected)) ? WL.ResetBit(PageInfo[Control.ClientTypeID].Selected.intStatus,status_selected) : WL.SetBit(PageInfo[Control.ClientTypeID].Selected.intStatus,status_selected);
								newObject.setProperties(PageInfo[Control.ClientTypeID].Selected);
								// store as selected object
								PageInfo[Control.ClientTypeID].oSelected = (WL.GetBit(PageInfo[Control.ClientTypeID].Selected.intStatus,status_selected)) ? newObject : null;

							}
						}
					newObject.setCurrent = 	function(){with(DataCommand){
								// if set reset current item
								if(PageInfo[Control.ClientTypeID].oCurrent != null){
									// reset current flag
									PageInfo[Control.ClientTypeID].Current.intStatus = WL.ResetBit(PageInfo[Control.ClientTypeID].Current.intStatus,status_current);
									// write properties of the current entry into the current record
									PageInfo[Control.ClientTypeID].oCurrent.setProperties(PageInfo[Control.ClientTypeID].Current);
								}
								// set current flag on selected
								PageInfo[Control.ClientTypeID].Current.intStatus = WL.SetBit(PageInfo[Control.ClientTypeID].Current.intStatus,status_current);
								// update idx property holder
								newObject.setProperties(PageInfo[Control.ClientTypeID].Current);
								// store as selected object
								PageInfo[Control.ClientTypeID].oCurrent = newObject;
								fn_selecttocurrent(Control.ClientTypeID)
							}
						}
					newObject.Previous =	function(){with(DataCommand){return (PageInfo[Control.ClientTypeID].oCurrent == newObject)}}
					newObject.Next = function(){with(DataCommand){
								// obtain a reference to the next sibbling
								var oNext = (newObject.nextSibling != undefined) ? newObject.nextSibling : newObject.parentElement.childNodes[0];
								// read it's properties
								oNext.getProperties();
								// return the reference
								return oNext;
							}
						}
					newObject.isCurrent = 	function(){with(DataCommand){return (PageInfo[Control.ClientTypeID].oCurrent == newObject)}}
					return newObject
				}
				var strContent = "";
				listElement.setProperties(recData);
				switch(recData.intTypeID){ //intColType
					case type_song:
					case type_playlist_song:
						listElement.appendChild(fn_createcontainer("DIV",recData.strSong,"cls_entry_title"));
						switch(recData.intMediaQuality){
							case media_flac : 	listElement.appendChild(fn_createcontainer("DIV","WAV","cls_entry_quality flac"));break
							case media_grps:	listElement.appendChild(fn_createcontainer("DIV","MOB","cls_entry_quality grps"));break
							case media_mp3:		switch(recData.intBitRate){
													case 32 : strContent = "32";break
													case 64 : strContent = "64";break
													case 96 : strContent = "96";break
													case 128 : strContent = "128";break
													case 192 : strContent = "192";break
													case 256 : strContent = "256";break
													case 320 : strContent = "320";break
													default : strContent = "VBR";break
												}
												listElement.appendChild(fn_createcontainer("DIV",strContent,"cls_entry_quality mp3"));
						}
						listElement.appendChild(fn_createcontainer("DIV",recData.strArtist,"cls_entry_artist"));
						listElement.appendChild(fn_createcontainer("DIV",recData.strYear,"cls_entry_year"));
						listElement.appendChild(fn_createcontainer("DIV",recData.strGenre,"cls_entry_genre"));
						listElement.appendChild(fn_createcontainer("DIV",recData.strDuration,"cls_entry_duration"));
						break
					case type_playlist:
						listElement.appendChild(fn_createcontainer("DIV",recData.strTitle,"cls_entry_title"));
						listElement.appendChild(fn_createcontainer("DIV",recData.intSongcount + " playlistliedje" + ((recData.intSongcount == 1)?"":"s"),"cls_entry_details"));
						break
					case type_date:
						if(recData.intYear !=0) listElement.appendChild(fn_createcontainer("DIV",recData.intYear,"cls_entry_date_year"))
						if(recData.intMonth !=0) listElement.appendChild(fn_createcontainer("DIV",WL.MonthName(recData.intMonth),"cls_entry_date_month"))
						if(recData.intDay !=0) listElement.appendChild(fn_createcontainer("DIV",WL.DayName(recData.intDay),"cls_entry_date_day"))
						break
					case type_artist:
						listElement.appendChild(fn_createcontainer("DIV",recData.strArtist,"cls_entry_title"));
						listElement.appendChild(fn_createcontainer("DIV",recData.intAlbumcount + " album" + ((recData.intAlbumcount == 1)?", ":"s, "),"cls_entry_artist_albumcount"));
						listElement.appendChild(fn_createcontainer("DIV",recData.intSongcount + " liedje" + ((recData.intSongcount == 1)?"":"s"),"cls_entry_artist_songcount"));
						break
					case type_album:
						listElement.appendChild(fn_createcontainer("DIV",recData.strAlbum,"cls_entry_title"));
						listElement.appendChild(fn_createcontainer("DIV",recData.strArtist,"cls_entry_album_artistname"));
						listElement.appendChild(fn_createcontainer("DIV",recData.intSongcount + " liedje" + ((recData.intSongcount == 1)?"":"s"),"cls_entry_album_songcount"));
						break
					case type_family:
						listElement.appendChild(fn_createcontainer("DIV",recData.strName,"cls_entry_title"));
						with(recData){
							if (intID == 1){
								listElement.appendChild(fn_createcontainer("DIV","local","cls_entry_status local"));
							}else{
								if (lngSeedLocal == lbgSeedRemote) listElement.appendChild(fn_createcontainer("DIV","up to date","cls_entry_status uptodate"));
								if (lngSeedLocal < lbgSeedRemote) listElement.appendChild(fn_createcontainer("DIV","outdated","cls_entry_status outdated"));
							}
						}
						listElement.appendChild(fn_createcontainer("DIV",recData.strDetails,"cls_entry_details"));
						break
				}
				return listElement;
			}
		}
		this.fn_currentmedia = function(){
			var strClass="";
			with(this){
				with(DataCommand){
					var StatusMessage = PageInfo[Control.ClientTypeID].ServerResultCount + " ";
					switch(Control.ClientTypeID){
						case type_playlist:			StatusMessage += "playlists";
													arrMenuButtons[4].className = "clsPlaylist";
													break
						case type_artist:			StatusMessage += "artiesten";
													arrMenuButtons[4].className = "clsArtists";
													break
						case type_album:			StatusMessage += "albums";
													arrMenuButtons[4].className = "clsAlbums";
													break
						case type_song:				StatusMessage += "liedjes";
													arrMenuButtons[4].className = "clsSongs";
													break
						case type_playlist_song:	StatusMessage += "playlistliedjes (" + PageInfo[type_playlist].Current.strTitle + ")";
													arrMenuButtons[4].className = "clsSongs";
													break
						case type_family:			StatusMessage += Language.family_loaded;
													arrMenuButtons[4].className = "clsFamily";
													break
													
					}
					arrMenuButtons[4].innerHTML = ""
					//arrMenuButtons[4].innerHTML = PageInfo[Control.ClientTypeID].ServerResultCount;
					if(PageInfo[Control.ClientTypeID].ServerPageCount > 1)	StatusMessage += ", pagina " + PageInfo[Control.ClientTypeID].ServerPageIndex + " van " + PageInfo[Control.ClientTypeID].ServerPageCount;
					return StatusMessage
				}
			}
		}
		this.fn_displayresults = function(iDbAction,sSearchString){
			with(this){
				bWalkResults = true;
				iCount = 0;
				sType = "";
				fn_add_option = function(iVal,strText){
					var objElement = document.createElement('option');
					objElement.value = iVal;
					objElement.innerHTML = strText;
					return objElement;
				}
				fn_transitions(false)
				with(DataCommand){
					switch(iDbAction){
						case type_artist:
						case type_album:
						case type_song:
						case type_playlist:
						case type_playlist_song:			Control.ClientTypeID = iDbAction;
															fn_browse_page(0);
															break
						case family_scan:					fn_dbexec(PageInfo[type_family].Selected.intID,iDbAction);break
						case db_browse_genre:				bWalkResults = false;
															fn_loadgenrepresets();
															for(intIndex = 1; intIndex < colQuery.length;  intIndex++) objFilter.Genre.appendChild(fn_add_option(colQuery[intIndex].intID,colQuery[intIndex].strGenre));
															break
						case db_browse_year:				bWalkResults = false;
															fn_loadyearpresets();
															for(intIndex = 1; intIndex < colQuery.length;  intIndex++) objFilter.Year.appendChild(fn_add_option(colQuery[intIndex].intYear,colQuery[intIndex].intYear));
															break
						case db_browse_artist_songs:		fn_dbexec(PageInfo[type_artist].Selected.intID,iDbAction);break
						case db_browse_artist_albums:		fn_dbexec(PageInfo[type_artist].Selected.intID,iDbAction);break
						case db_browse_artist_albums_va:	fn_dbexec(PageInfo[type_artist].Selected.intID,iDbAction);break
						case db_browse_album_songs:			fn_dbexec(PageInfo[type_album].Selected.intID,iDbAction);break
						case db_browse_history:				fn_loadhistorypresets();break
						case db_browse_history_selection:	fn_gethistory(sSearchString);
															switch(Control.ServerTypeID){
																case type_artist:	fn_page_status("Dit zijn alle binnen deze periode gevonden artiesten");break
																case type_album:	fn_page_status("Dit zijn alle binnen deze periode gevonden albums");break
																case type_song:		fn_page_status("Dit zijn alle binnen deze periode gevonden liedjes");break
															}
															break
						case db_playlist_list_songs:		fn_dbexec(PageInfo[type_playlist].Selected.intID,iDbAction);break //fn_playlist_list_songs();break
						case db_playlist_list_albums:		fn_dbexec(PageInfo[type_playlist].Selected.intID,iDbAction);break //fn_playlist_list_albums();break
						case db_playlist_list_artists:		fn_dbexec(PageInfo[type_playlist].Selected.intID,iDbAction);break //fn_playlist_list_artists();break
						case db_playlist_list: 				fn_dbexec(PageInfo[type_playlist].Selected.intID,iDbAction);break //fn_playlist_list();break
						case db_playlist_list_add: 			fn_playlist_list_add();break
						case db_playlist_list_delete: 		fn_dbexec(PageInfo[type_playlist].Selected.intID,iDbAction);break //fn_playlist_list_delete();break
						case db_playlist_list_update: 		fn_playlist_list_update();break
						case db_playlist_list_clear:		fn_dbexec(PageInfo[type_playlist].Selected.intID,iDbAction);break
/*						case db_playlist_copysongs:			Control.ClientTypeID = type_song;
															get current 
															fn_browse_page(0);
															Control.ClientTypeID = type_playlist_song;
															break */
						case db_browse_page:				iTimes = 1;
															hfn_selectpage = WL.fn_cleartimer(hfn_selectpage);
															fn_browse_page(sSearchString);
															break
						case db_search:						strMediaSearch = (sSearchString.length == 0) ? "%%" : sSearchString
															fn_search_execute();
															break;
						case db_playlist_list_artist_add:
						case db_playlist_list_album_add:
						case db_playlist_list_song_delete:
						case db_playlist_list_song_add:		if(PageInfo[type_playlist].Current.intID !=0){
																Control.strSelSet = "";
																for(intIndex = 0; intIndex < objResultContainer.current.childNodes.length; intIndex++){
																	objResultContainer.current.childNodes[intIndex].getProperties();
										//							avoid processing placeholders
																	if(Control.ClientTypeID == type_void) break;
																	if(WL.GetBit(PageInfo[Control.ClientTypeID].Selected.intStatus,status_selected)){
										//								reset status_selected bit
																		PageInfo[Control.ClientTypeID].Selected.intStatus = WL.ResetBit(PageInfo[Control.ClientTypeID].Selected.intStatus,status_selected);
										//								update topic
																		objResultContainer.current.childNodes[intIndex].setProperties(PageInfo[Control.ClientTypeID].Selected);
										//								build xml select string
																		Control.strSelSet += "<item>" + PageInfo[Control.ClientTypeID].Selected.intID + "</item>";
																		switch(Control.ClientTypeID){
																			case type_playlist:			sType="";break
																			case type_artist:			sType="artist";break
																			case type_album:			sType="albums";break
																			case type_playlist_song: 	sType="playlist liedjes";break
																			case type_song:				sType="liedjes";break
																		}
																		iCount++;
																	}
																}
																switch(iDbAction){
																	case db_playlist_list_song_delete: 		sAction = " verwijderen ?";break
																	case db_playlist_list_song_add:
																	case db_playlist_list_album_add:
																	case db_playlist_list_artist_add:		sAction = " toevoegen ?";break
																}
																if((iCount!=0) && confirm("Wil je " + iCount + " " + sType + sAction)){
																	// normally set by IDA, force playlist_song type
								//									DataCommand.Control.ClientTypeID = type_playlist_song;
																	fn_dbexec(PageInfo[type_playlist].Current.intID,iDbAction);
																	bWalkResults = false;
																}else{fn_busy(false)}
															}else{
																alert('je hebt nog geen playlist geselecteerd !');
															}
								//							uistate = WL.ResetBit(uistate,uistate_select);
															break
						case list_moveup:
						case list_movedown:					switch(iDbAction){
																case list_moveup:
																		for(intIndex = 0; intIndex < objResultContainer.current.childNodes.length; intIndex++){
																			objResultContainer.current.childNodes[intIndex].getProperties();
												//							avoid processing placeholders
																			if(Control.ClientTypeID == type_void) break;
																			if(WL.GetBit(PageInfo[Control.ClientTypeID].Selected.intStatus,status_selected)) objResultContainer.current.childNodes[intIndex].moveUp();
																		}
																		break
																case list_movedown:
																		for(intIndex = objResultContainer.current.childNodes.length-1; intIndex >= 0; intIndex--){
																			objResultContainer.current.childNodes[intIndex].getProperties();
												//							avoid processing placeholders
																			if((Control.ClientTypeID != type_void) && WL.GetBit(PageInfo[Control.ClientTypeID].Selected.intStatus,status_selected)) objResultContainer.current.childNodes[intIndex].moveDown()
																		}
																		break
															}
															Control.strSelSet = "";
															for(intIndex = 0; intIndex < objResultContainer.current.childNodes.length; intIndex++){
																objResultContainer.current.childNodes[intIndex].getProperties();
									//							avoid processing placeholders
																if(Control.ClientTypeID == type_void) break;
								//								build xml select string
																Control.strSelSet += "<item>" + PageInfo[Control.ClientTypeID].Selected.intID + "</item>";
															}
															// normally set by IDA, force playlist_song type
															fn_dbexec(PageInfo[type_playlist].Current.intID,db_playlist_save_sortorder);
															bWalkResults = false;
															break
						case family_list:					fn_dbexec(0,iDbAction);break

						default:							fn_page_status("fn_displayresults: unhandled (" + iDbAction + ")");
															bWalkResults = false;
					}
					// move resultpane back to top position
					fn_transitions(false)
					// if no results are returned check Settings.ServerPageRecordCount and prepop logic
					if(bWalkResults){
						objResultContainer.style.top = "0px"
						PageInfo[Control.ServerTypeID].PanePosition = 0;
						var objTarget = fn_resultselector(Control.ServerTypeID);
						if(colQuery.length == 0){
	//						clean up by replacing the prepopulated entries by voids
							for(intIndex = 0; intIndex < objTarget.childNodes.length; intIndex++) objTarget.replaceChild(fn_create_content(recVoid),objTarget.childNodes[intIndex]);
						}else{
	//						replace the prepop entries with the colquery contents
							for(intIndex = 0; intIndex < objTarget.childNodes.length; intIndex++) objTarget.replaceChild(fn_create_content((intIndex < colQuery.length) ? colQuery[intIndex+1] : recVoid),objTarget.childNodes[intIndex]);
							// only display the pager if pagecount > 1
							if(PageInfo[Control.ServerTypeID].ServerPageCount > 1) objFooterSwipeDiv.style.left = "0px";

						}
						
						fn_page_status(fn_currentmedia())
					}
					fn_busy(false);
				}
			}
		}
		this.fn_execute = function(sCmd){
			with(this){
				//uistate = WL.SetBit(uistate,uistate_splash);
				fn_busy(true,"een moment geduld a.u.b.");
				fn_uistate_update()
				setTimeout("TellaVision." + sCmd,100);
			}
		}
		this.fn_footermenu = function(iMode){
			var scaption = "";
			with(this){
				switch(iMode){
					case uistate_family:
						fn_setbutton(arrFooterButtons[5],"verstuur<br>code",family_invite,"clsButtonBrowse")
						fn_setbutton(arrFooterButtons[6],"accepteer<br>code",family_accept,"clsButtonBrowse");
						fn_setbutton(arrFooterButtons[7],"toon<br>familie",family_list,"clsButtonBrowse");
						fn_setbutton(arrFooterButtons[8],"scan<br>familie",family_scan,"clsButtonBrowse");
						fn_setbutton(arrFooterButtons[9],"geen<br>functie",type_void,"clsButtonBrowse");
						objFooterSwipeDiv.style.left = "-" + (intSwipeWindowWidth) + "px";
						break
					case uistate_searchmode:
						objFooterSwipeDiv.style.left = "0px";
						break
					case uistate_history:
						fn_setbutton(arrFooterButtons[5],Language.db_browse_history_today,db_browse_history_today,"clsButtonBrowse")
						fn_setbutton(arrFooterButtons[6],Language.db_browse_history_yesterday,db_browse_history_yesterday,"clsButtonBrowse");
						fn_setbutton(arrFooterButtons[7],Language.db_browse_history_week,db_browse_history_week,"clsButtonBrowse");
						fn_setbutton(arrFooterButtons[8],Language.db_browse_history_month,db_browse_history_month,"clsButtonBrowse");
						fn_setbutton(arrFooterButtons[9],Language.db_browse_history_selection,db_browse_history_selection,"clsButtonBrowse")
						objFooterSwipeDiv.style.left = "-" + (intSwipeWindowWidth) + "px";
						break
					case type_artist:
					case type_album :
					case type_song :
						fn_setbutton(arrFooterButtons[5],Language.db_browse_artist_albums,db_browse_artist_albums,"clsButtonBrowse")
						fn_setbutton(arrFooterButtons[6],Language.db_browse_artist_songs,db_browse_artist_songs,"clsButtonBrowse");
						if(WL.GetBit(uistate,uistate_select)){
							fn_setbutton(arrFooterButtons[7],Language.sysmode_listplay,uistate_select,"clsButtonRed");
						}else{
							fn_setbutton(arrFooterButtons[7],Language.sysmode_directplay,uistate_select,"clsButtonBlue");
						}
						fn_setbutton(arrFooterButtons[8],Language.db_browse_artist_albums_va,db_browse_artist_albums_va,"clsButtonBrowse");
						switch(DataCommand.intMediaQuality){
							case media_flac:	scaption = Language.media_flac;break
							case media_mp3:		scaption = Language.media_mp3;break
							case media_grps:	scaption = Language.media_grps;break
							case media_all:		scaption = Language.media_all;break
						}
						fn_setbutton(arrFooterButtons[9],scaption,DataCommand.intMediaQuality,"clsButtonBrowse")
						objFooterSwipeDiv.style.left = "-" + (intSwipeWindowWidth) + "px";
						break
					case type_playlist:
						if(WL.GetBit(uistate,uistate_select)){
							fn_setbutton(arrFooterButtons[5],Language.db_playlist_list_delete,db_playlist_list_delete,"clsButtonBlue");
							fn_setbutton(arrFooterButtons[6],Language.db_playlist_list_add,db_playlist_list_add,"clsButtonBlue");
							fn_setbutton(arrFooterButtons[7],Language.playlist_browse,uistate_select,"clsButtonRed");
							fn_setbutton(arrFooterButtons[8],"",type_void,"clsDisabledButton");
							fn_setbutton(arrFooterButtons[9],Language.db_playlist_list_update,db_playlist_list_update,"clsButtonBlue");
						}else{
							fn_setbutton(arrFooterButtons[5],Language.db_playlist_list,db_playlist_list,"clsButtonBrowse")
							fn_setbutton(arrFooterButtons[6],"",type_void,"clsDisabledButton");
							fn_setbutton(arrFooterButtons[7],Language.playlist_edit,uistate_select,"clsButtonBlue");
							fn_setbutton(arrFooterButtons[8],"",type_void,"clsDisabledButton");
							fn_setbutton(arrFooterButtons[9],Language.btn_current_playlist,db_playlist_list_songs,"clsButtonBrowse")
						}
						objFooterSwipeDiv.style.left = "-" + (intSwipeWindowWidth) + "px";
						break
					case type_playlist_song :
						if(WL.GetBit(uistate,uistate_select)){
							fn_setbutton(arrFooterButtons[5],"selectie<br>omhoog",list_moveup,"clsButtonBlue")
							fn_setbutton(arrFooterButtons[6],"",type_void,"clsDisabledButton")
							fn_setbutton(arrFooterButtons[7],"browse<br>playlist",uistate_select,"clsButtonBrowse");
							fn_setbutton(arrFooterButtons[8],"uit<br>playlist",db_playlist_list_song_delete,"clsButtonBlue")
							fn_setbutton(arrFooterButtons[9],"selectie<br>omlaag",list_movedown,"clsButtonBlue")
						}else{
							fn_setbutton(arrFooterButtons[5],Language.db_browse_artist_albums,db_browse_artist_albums,"clsButtonBrowse")
							fn_setbutton(arrFooterButtons[6],Language.db_browse_artist_songs,db_browse_artist_songs,"clsButtonBrowse");
							fn_setbutton(arrFooterButtons[7],"edit<br>playlist",uistate_select,"clsButtonBlue");
							fn_setbutton(arrFooterButtons[8],Language.db_browse_artist_albums_va,db_browse_artist_albums_va,"clsButtonBrowse");
							fn_setbutton(arrFooterButtons[9],Language.db_playlist_list,db_playlist_list,"clsButtonBrowse")
						}
						objFooterSwipeDiv.style.left = "-" + (intSwipeWindowWidth) + "px";
						break						
					}
			}		
		}
		this.fn_keyboard = function(event,touchmode){
			with(this){
				//uistate = WL.SetBit(uistate,uistate_footer);
				switch(touchmode){
					case "lick":	if(WL.GetBit(uistate,uistate_searchmode)){
										uistate = WL.ResetBit(uistate,uistate_message_chatbox);
										uistate = WL.SetBit(uistate,uistate_message_execute);
										uistate = WL.SetBit(uistate,uistate_message_inputbox);
									}
									break
					case "move":	event.preventDefault;
									strSearchString = "";
									objMessageContainer.Inputbox.value = "";					
									break
					case "click":	uistate = WL.ResetBit(uistate,uistate_message_execute);
									uistate = WL.ResetBit(uistate,uistate_message_chatbox);
									uistate = WL.SetBit(uistate,uistate_message_inputbox);
									//strSearchString = "";
									//objMessageContainer.Inputbox.value = "";
									break
					case "blur":	if(WL.GetBit(uistate,uistate_searchmode)){
										//uistate = WL.SetBit(uistate,uistate_message_execute);
										uistate = WL.SetBit(uistate,uistate_message_chatbox);
										uistate = WL.ResetBit(uistate,uistate_message_inputbox);
										strSearchString = objMessageContainer.Inputbox.value
										//fn_uistate_update()
										fn_execute("fn_displayresults(db_search,TellaVision.strSearchString)");
									}
									if(WL.GetBit(uistate,uistate_playlist_delete)){
										uistate = WL.ResetBit(uistate,uistate_playlist_delete);
										uistate = WL.ResetBit(uistate,uistate_keyboard);
										fn_execute("fn_displayresults(db_playlist_list_delete)")
									}
									if(WL.GetBit(uistate,uistate_playlist_update)){
										uistate = WL.ResetBit(uistate,uistate_playlist_update);
										uistate = WL.ResetBit(uistate,uistate_keyboard);
										DataCommand.PageInfo[type_playlist].Selected.strTitle = objMessageContainer.Inputbox.value;
										fn_execute("fn_displayresults(db_playlist_list_update)")
									}
									if(WL.GetBit(uistate,uistate_playlist_new)){
										uistate = WL.ResetBit(uistate,uistate_playlist_new);
										uistate = WL.ResetBit(uistate,uistate_keyboard);
										DataCommand.PageInfo[type_playlist].Selected.strTitle = objMessageContainer.Inputbox.value;
										alert(objMessageContainer.Inputbox.value)
										fn_execute("fn_displayresults(db_playlist_list_add)")
									}
									uistate = WL.SetBit(uistate,uistate_results);
									uistate = WL.SetBit(uistate,uistate_footer);
									break
				}
				fn_uistate_update()
			}
		}
		this.fn_logonuser = function(strPass){
			with(this)
			{
				//fn_set_uimode(uimode_logon)
				fn_page_status("<strong>Koekeloer - Inloggen</strong><br><br>Een moment geduld a.u.b. terwijl de server jouw code controleerd....");
				if(strPass != '' && DataCommand.fn_piratelogic_register(strPass))
				{
					Settings.bGuest = false
					with(DataCommand){
						PageInfo[type_user].Current.intUserID = colQuery[1].intUserID
						PageInfo[type_user].Current.intPlaylistID = colQuery[1].intPlaylistID
						PageInfo[type_user].Current.strFirstName = colQuery[1].strFirstName
						PageInfo[type_user].Current.strLastName = colQuery[1].strLastName
						PageInfo[type_user].Current.strPubName = colQuery[1].strPubName
						PageInfo[type_user].Current.strEmailAlias = colQuery[1].strEmailAlias
						PageInfo[type_user].Current.strIPadress = colQuery[1].strIPadress
						with(colServers[1])
						{
							fn_page_status("<div style='text-align:center;margin:3px;color:#222;width:300px;height:378px;color:#888;background:url(skinimg/iphone/iphone-startuplogo.jpg) no-repeat;'><div style='padding-top:90px;font-size:12pt;'>Welkom " + strCurrentUser + "</div><div style='padding-top:240px;font-size:8pt;'>" + Settings.AppVersion + "C" + Settings.MyIP + "S" + strWAN_IPadress + ":" + intWAN_ServerPort + "/" + intWAN_StreamPort + "</div></div>")
						}
					}
				}
				else
				{
					fn_page_status("<strong>Koekeloer - Inloggen Mislukt</strong><br><br>De code welke je hebt ingevoerd, <span class='clsSearchField'>" + strPass + "</span>, word jammergenoeg niet door deze Koekeloer server herkend. Het kan zijn dat je een verkeerde code hebt ingetikt of een type fout gemaakt hebt, probeer het nog eens...");
				}
			}
		}
		this.fn_mainmenu = function(){
			with(this){
				if(WL.GetBit(uistate,uistate_remote)){
					objMainMenuMessage.innerHTML = "local"
					uistate = WL.ResetBit(uistate,uistate_remote)
				}else{
					objMainMenuMessage.innerHTML = "remote"
					uistate = WL.SetBit(uistate,uistate_remote);
				}
				fn_uistate_update()
			}
		}
		this.fn_orientationchange = function(bUiUpdate){
			with(this){
				switch(window.orientation){
					case 90:
					case -90:
						uistate = WL.SetBit(uistate,uistate_landscape);
						document.body.setAttribute("class", "landscape");
						break
					case 0:
						uistate = WL.ResetBit(uistate,uistate_landscape);
						document.body.setAttribute("class", "portrait");
						break
				}
				if(bUiUpdate) fn_uistate_update();
			}
		}
		this.fn_prepopulate = function(oTarget){
			with(this){
				for(intIndex = 0; intIndex < Settings.ServerPageRecordCount; intIndex++) oTarget.appendChild(fn_create_content(DataCommand.recVoid));
			}
		}		
		this.fn_processfinger = function(ID){
			// called from fn_resultscroller, takes action depending on the type of id tapped.’’
			var oSource = Object;
			var oTarget = Object;
			with(this){
				with(DataCommand){
					switch(Control.ClientTypeID){
						case type_date:		fn_execute("fn_displayresults(db_browse_history_selection,strDateSelection)");break
						case type_playlist:	if(WL.GetBit(uistate,uistate_playlist_new) || WL.GetBit(uistate,uistate_playlist_update) || WL.GetBit(uistate,uistate_playlist_delete)){
												objMessageContainer.Inputbox.value = PageInfo[type_playlist].Selected.strTitle;
											}else{
												ID.setCurrent();
												uistate = WL.ResetBit(uistate,uistate_playlist);
												fn_uistate_update();
												fn_execute("fn_displayresults(db_playlist_list_songs,'')");
											}break
						case type_artist:	fn_execute("fn_displayresults(db_browse_artist_albums,'')");break
						case type_album:	fn_execute("fn_displayresults(db_browse_album_songs,'')");break
						case type_playlist_song:
											if(Settings.bGuest)
												{}//fn_set_uimode(uimode_logon);
											else{
												ID.setCurrent()
												if(WL.GetBit(uistate,uistate_remote)){
													fn_player_server();
													fn_setmediaplayerbuttons(db_player_start);
												}else {fn_qtplayer()}
											} break
						case type_song : 	if(Settings.bGuest)
												{}//fn_set_uimode(uimode_logon);
											else{
												ID.setCurrent()
												if(WL.GetBit(uistate,uistate_remote)){
													fn_player_server();
													// clone songs to playlistsongs pane
													// fn_displayresults(type_playlist_song,0)
													fn_setmediaplayerbuttons(db_player_start);
												}else {fn_qtplayer()}
												//fn_showcurrentstatus();
											} break
						case type_family:	fn_execute("fn_displayresults(family_scan,'')");break
					}
				}
				fn_uistate_update()
			}
		}
		this.fn_page_status = function(strMessage){
			with(this){
				if(WL.GetBit(uistate,uistate_searchmode) && (!strMessage)){ //
					switch(DataCommand.intMediaQuality){
						case media_flac: strMsg = "<span class='clsSearchField'>flac</span> ";break
						case media_mp3: strMsg = "<span class='clsSearchField'>mp3</span> ";break
						case media_grps: strMsg = "<span class='clsSearchField'>grps</span> ";break
						case media_all: strMsg = "";break
					}
					if(DataCommand.PageInfo[type_genre].Selected.intID != -1) strMsg += "<span class='clsSearchField'>" + DataCommand.PageInfo[type_genre].Selected.strGenre + "</span> "
					switch(DataCommand.Control.ClientTypeID){
						case type_artist: strMsg += "<span class='clsSearchField'>artiest</span>";break
						case type_album: strMsg += "<span class='clsSearchField'>album</span>";break
						case type_song: strMsg += "<span class='clsSearchField'>liedje</span>";break
					}
					if(DataCommand.PageInfo[type_year].Selected.strYear !="") strMsg += " uit <span class='clsSearchField'>" + DataCommand.PageInfo[type_year].Selected.strYear + "</span>"
					switch(DataCommand.intSearchMode){
						case search_targeting_begin: strMsg += " begint met"; break
						case search_targeting_loose: strMsg += " bevat"; break
						case search_targeting_exact: strMsg += " is exact"; break
					}
					objMessageContainer.Chatbox.innerHTML = strMsg;
					
					switch(DataCommand.Control.ClientTypeID){
						case type_playlist:			arrMenuButtons[4].className = "clsPlaylist";
													break
						case type_artist:			arrMenuButtons[4].className = "clsArtists";
													break
						case type_album:			arrMenuButtons[4].className = "clsAlbums";
													break
						case type_song:				arrMenuButtons[4].className = "clsSongs";
													break
						case type_playlist_song:	arrMenuButtons[4].className = "clsSongs";
													break
						case type_family:			arrMenuButtons[4].className = "clsFamily";
													break
					}
					
					
					
					
				}else
					objMessageContainer.Chatbox.innerHTML = (strMessage) ? strMessage : fn_currentmedia();
				

			}
		}
		this.fn_qtplayer = function(){
			var QTurl = "http://";
			var iServer = 0;
			var bPlayOK = true;
			with(this){
				//	use the server collection ip and port data
				iServer = DataCommand.PageInfo[DataCommand.Control.ClientTypeID].Current.intServerID;
				if(iServer == 0) iServer = 1;
				//alert(DataCommand.colServers[2].strIP)
//				with(DataCommand.colServers[DataCommand.PageInfo[DataCommand.Control.ClientTypeID].Current.intServerID+1]) QTurl += strIP + ":" +  intStreamPort  + "/mp3?";
//				with(DataCommand.colServers[DataCommand.PageInfo[DataCommand.Control.ClientTypeID].Current.intServerID+1]) QTurl += strIP + "/mp3?";
				with(DataCommand.colServers[iServer]) {
				QTurl += strIP + ((intStreamPort == 80) ? "?" : ":" +  intStreamPort  + "?");
				}
				with(DataCommand.PageInfo[DataCommand.Control.ClientTypeID].Current){
					QTurl += (intServerID==0) ? intID:lngForeignID
					bPlayOK = (intMediaQuality != media_flac)
				}
				//alert(QTurl);
				if(bPlayOK){
					objQTplayer.SetURL(QTurl);
					objQTplayer.Play();
				}else{alert('Sorry, maar de iphone speelt (nog) geen WAV files !')}
			}
		}
		this.fn_qtelement = function(){
			var listElement = document.createElement('EMBED');
			var strout = 'id="qtPlayer" ';
			strout += 'src="" ';
			strout += 'width="0" ';
			strout += 'height="0" ';
			strout += 'scale="1" ';
			strout += 'target="myself" ';
			strout += 'type="audio/mpeg" ';
			strout += 'autoplay="true" ';
			strout += 'qtnext1="<http://192.168.1.104:81/stream?=1>" ';
			strout += 'qtnext2="<http://192.168.1.104:81/stream?2>" ';
			strout += 'qtnext3="<http://192.168.1.104:81/stream?3>" ';
			strout += 'qtnext4="<http://192.168.1.104:81/stream?4>" ';
			strout += 'qtnext5="<http://192.168.1.104:81/stream?5>" ';
			strout += 'qtnext6="<http://192.168.1.104:81/stream?6>" ';
			strout += 'qtnext7="<http://192.168.1.104:81/stream?7>" ';
			strout += 'qtnext8="<http://192.168.1.104:81/stream?8>" ';
			strout += 'qtnext9="<http://192.168.1.104:81/stream?9>" ';
			strout += 'qtnext10="<http://192.168.1.104:81/stream?10>" ';
			strout += 'qtnext11="<http://192.168.1.104:81/stream?11>" ';
			strout += 'qtnext12="<http://192.168.1.104:81/stream?12>" ';
			strout += 'prefixhost="true" ';
			strout += 'allowembedtagoverrides="true" ';
			strout += 'enablejavascript="true" ';
			strout += 'postdomevents="true" ';
			strout += 'showlogo="true" ';
			strout += 'controller="false" ';
			strout += 'loop="false" ';
			strout += 'name="qtMediaPlayer" ';
			listElement.innerHTML = strout;
			return listElement;
		}
		this.fn_qtevent = function(strEvent){
			with(this){
				switch(strEvent){
					case "qt_ended":
							if(objQTplayer.GetPluginStatus() != "Waiting")
								setTimeout("TellaVision.fn_qtevent('qt_ended')" ,100);
							else
								var evtQT = document.createEvent("MouseEvents");
//								evtQT.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
								evtQT.initMouseEvent("click", true, true);
								objQTnext.dispatchEvent(evtQT);
//								eval("TellaVision.fn_qtnext()");
							break
					case "qt_begin":
					case "qt_loadedmetadata":
					case "qt_enterfullscreen":
					case "qt_exitfullscreen":
					case "qt_canplay":
					case "qt_error":
					case "qt_play":
					case "qt_pause":
					case "qt_timechanged":
					case "qt_volumechange":		break
				}
			}
		}
		this.fn_qtnext = function(event){
			with(this)
			{
				fn_processfinger(DataCommand.PageInfo[DataCommand.Control.ClientTypeID].oCurrent.Next());
			}
		}
		this.fn_resultselector = function(ctype){
			with(this){
				fn_transitions(false)
				with(objResultContainer){
					DataCommand.PageInfo[DataCommand.Control.ClientTypeID].PanePosition = offsetTop;
					album.style.display = "none";
					songs.style.display = "none";
					history.style.display = "none";
					playlistsongs.style.display = "none";
					playlists.style.display = "none";
					artists.style.display = "none";
					dialog.style.display = "none";
					family.style.display = "none";
				}
				if(isNaN(ctype)){
					objResultContainer.dialog.style.top = "0px";
					objResultContainer.dialog.style.display = "";
					objResultContainer.current = objResultContainer.dialog;
				}else{
					DataCommand.Control.ClientTypeID = ctype;
					switch(ctype){
						case type_date:				objResultContainer.current = objResultContainer.history;break
						case type_playlist :		objResultContainer.current = objResultContainer.playlists;break
						case type_playlist_song : 	objResultContainer.current = objResultContainer.playlistsongs;	break
						case type_artist:			objResultContainer.current = objResultContainer.artists;
													DataCommand.Control.SearchType = ctype;
													break
						case type_album : 			objResultContainer.current = objResultContainer.album;
													DataCommand.Control.SearchType = ctype;
													break
						case type_song : 			objResultContainer.current = objResultContainer.songs;
													DataCommand.Control.SearchType = ctype;
													break
						case type_family : 			objResultContainer.current = objResultContainer.family;break
					}
				}
				objResultContainer.style.top = DataCommand.PageInfo[DataCommand.Control.ClientTypeID].PanePosition + "px"; //"0px";
				objResultContainer.current.style.display = "";
				fn_transitions(true);
				if(WL.GetBit(uistate,uistate_history)){
					switch(DataCommand.Control.ClientTypeID){
						case type_artist: fn_page_status("gedraaide artiest");break
						case type_album:fn_page_status("gedraaide albums");break
						case type_song:fn_page_status("gedraaide liedjes");break
					}
				} else fn_footermenu(DataCommand.Control.ClientTypeID);
				return objResultContainer.current;
			}
		}
		this.fn_pingpong = function(){
			with(this){
				with(DataCommand){
					if(fn_pingpong()){
						// only do this when in rc mode to avoid messing up the local iphone playlist
						if(WL.GetBit(uistate,uistate_remote)){
							fn_volumesetslider()
							// there was a change within the server playlist
							var objTarget = fn_resultselector(type_playlist_song);
							if(colQuery.length == 0){
								// it was just an index change, see if we already updated oCurrent
								if(DataCommand.PageInfo[type_playlist_song].oCurrent != objTarget.childNodes[PageInfo[type_playlist_song].ServerPageRecordIndex-1]){
									// dhtml col is base 0 so substract 1 from index
									objTarget.childNodes[PageInfo[type_playlist_song].ServerPageRecordIndex-1].setCurrent();
									// roll item into viewport
									objResultContainer.style.top = -DataCommand.PageInfo[type_playlist_song].oCurrent.offsetTop + "px";
									// store PanePosition
									PageInfo[type_playlist_song].PanePosition = objResultContainer.offsetTop;
								}
							}else{
								// a new set got loaded, update accordingly
								for(intIndex = 0; intIndex < objTarget.childNodes.length; intIndex++){
									if(intIndex < colQuery.length)
										objTarget.replaceChild(fn_create_content(colQuery[intIndex+1]),objTarget.childNodes[intIndex]);
									else
										objTarget.replaceChild(fn_createcontainer("DIV","","cls_type_placeholder"),objTarget.childNodes[intIndex]);
								}
								// roll item into viewport top
								objResultContainer.style.top = -DataCommand.PageInfo[type_playlist_song].oCurrent.offsetTop + "px";
								// store PanePosition
								PageInfo[type_playlist_song].PanePosition = objResultContainer.offsetTop;
								fn_page_status(fn_currentmedia())
							}
						}
					}
				}
			}
		}
		this.fn_resultscroller = function(event,touchmode){
			event.preventDefault()
			var iVerticalScroller = 0;
			if(event.changedTouches.length == 1){
				var touch = event.changedTouches[0]; // Get the information for finger #1
				with(this){
					// take the appropriate action
					switch(touchmode){
						case "touchmove":
							// avoid responding to body clicks
							bValidTouch = (objResult != oTouchTarget)
							if(bValidTouch){
								//	reset click handler
								bPerformClick = false;
								// set treshold
								if(Math.abs(parseInt(intFingerStartPosition_Y - touch.clientY)) > intFingerTreshold_Y){
									// calculate target position
									intContainerEndPosition_Y = intContainerStartPosition_Y - (intFingerStartPosition_Y - touch.clientY) * 3;
									// avoiding ending up halfway an entry
									intContainerEndPosition_Y = Math.round(intContainerEndPosition_Y / intEntryHeight) * intEntryHeight;
									// clip top
									if(intContainerEndPosition_Y > 0) intContainerEndPosition_Y = 0;
									// clip bottom
									if(intContainerEndPosition_Y < - parseInt(objResultContainer.offsetHeight - objResult.offsetHeight)){
										intContainerEndPosition_Y = - parseInt(objResultContainer.offsetHeight - objResult.offsetHeight);
									}
									// move result pane
									objResultContainer.style.top = intContainerEndPosition_Y + "px";
								}
							}
							break
						case "touchstart":
							//	tell datacommand we're busy and it should holdoff any ajax queries
							DataCommand.bSysBusy = true
							// set oTouchTarget to the originating element
							oTouchTarget = touch.target;
							// avoid responding to body clicks
							bValidTouch = (objResult != oTouchTarget)
							if(bValidTouch){
								// if we clicked a child move up the hierachy until we got the entry container
								while(oTouchTarget.parentElement.parentElement != objResultContainer) {oTouchTarget = oTouchTarget.parentElement;}
								// read IDX
								oTouchTarget.getProperties()
								// select da bastet
								oTouchTarget.Toggle();
							}
							// store finger start positions
							intFingerStartPosition_X = parseInt(touch.clientX);
							intFingerStartPosition_Y = parseInt(touch.clientY);
							// store container start positions
							intContainerStartPosition_Y = objResultContainer.offsetTop;
							// set click logic
							bPerformClick = bValidTouch;
							break
						case "touchend":
							if(!WL.GetBit(uistate,uistate_select)){
							//	we are not in select mode so reset the touched object
								if(bValidTouch) oTouchTarget.Toggle();
								if(bValidTouch && bPerformClick)
									fn_processfinger(oTouchTarget)
								else{
									iVerticalScroller = parseInt(intFingerStartPosition_X - touch.clientX)
									if(Math.abs(iVerticalScroller) > intFingerTreshold_X){
										with(DataCommand){
											if(iVerticalScroller > 1)		//	scroll right
												switch(Control.ClientTypeID){
													case type_playlist :		fn_resultselector(type_playlist_song);break
													case type_playlist_song : 	fn_resultselector(type_playlist);break
													case type_artist:			fn_resultselector(type_album);break
													case type_album : 			fn_resultselector(type_song);break
													case type_song : 			fn_resultselector(type_artist);break //fn_resultselector((WL.GetBit(uistate,uistate_searchmode)) ? type_artist : type_playlist);break
												}
											else							//	scroll left
												switch(Control.ClientTypeID){
													case type_playlist :		fn_resultselector(type_playlist_song);break
													case type_playlist_song : 	fn_resultselector(type_playlist);break
													case type_artist:			fn_resultselector(type_song);break //fn_resultselector((WL.GetBit(uistate,uistate_searchmode)) ? type_song : type_playlist_song);break
													case type_album : 			fn_resultselector(type_artist);break
													case type_song : 			fn_resultselector(type_album);break
												}
											}
											//intSearchFieldType = Control.ClientTypeID;
										}
										fn_page_status();
									}
							}else{
								// cleanup selected swiped objects
								if(bValidTouch && !bPerformClick) oTouchTarget.Toggle();
							}
							break
					}
				}
			}
		}
		this.fn_selectpage = function(iAction){
			var iPage = 0;
			with(this){
				with(DataCommand.PageInfo[DataCommand.Control.ClientTypeID]){
					fn_busy(true,"een moment geduld aub")
					hfn_selectpage = WL.fn_cleartimer(hfn_selectpage)
					switch(iAction){
						case db_browse_firstpage:		if(ServerPageIndex != 1) hfn_selectpage = setTimeout("TellaVision.fn_displayresults(db_browse_page,1)",10); break
						case db_browse_previouspage:	if(ServerPageIndex != 1){
															iPage = parseInt(ServerPageIndex - iTimes);
															iPage = (iPage>0) ? iPage:1;
															fn_page_status("laad pagina " + iPage + " van " + ServerPageCount);
															hfn_selectpage = setTimeout("TellaVision.fn_displayresults(db_browse_page," + iPage + ")",1000);
															iTimes++;
														}
														break
						case db_browse_nextpage:		if(ServerPageIndex != ServerPageCount){
															iPage = parseInt(ServerPageIndex + iTimes)
															iPage = (iPage <= ServerPageCount) ? iPage:ServerPageCount;
															fn_page_status("bezig met ophalen van pagina " + iPage + " van " + ServerPageCount);
															hfn_selectpage = setTimeout("TellaVision.fn_displayresults(db_browse_page," + iPage + ")",1000);
															iTimes++;
														}
														break
						case db_browse_lastpage:		if(ServerPageIndex != ServerPageCount)	hfn_selectpage = setTimeout("TellaVision.fn_displayresults(db_browse_page," + ServerPageCount + ")",10); break
					}
					if(hfn_selectpage == 0)	fn_busy(false)
				}
			}
		}
		this.fn_selecthandler = function(oSelect){
			with(this){
				switch(oSelect){
					case objFilter.Genre:
							DataCommand.PageInfo[type_genre].Selected.intID = oSelect.value;
							DataCommand.PageInfo[type_genre].Selected.strGenre = oSelect.options[oSelect.selectedIndex].text;
							if(oSelect.value == -1)	WL.removeClass(oSelect,"clsSelected"); else WL.addClass(oSelect,"clsSelected"); 
							fn_page_status();
							break
					case objFilter.Year:
							DataCommand.PageInfo[type_year].Selected.intID = oSelect.value;
							DataCommand.PageInfo[type_year].Selected.strYear =  oSelect.value; //oSelect.options[oSelect.selectedIndex].text;
							//if(oSelect.value == "")	WL.addClass(oSelect,"clsSelected"); else WL.removeClass(oSelect,"clsSelected");
							fn_page_status();
							break
					default: event.preventDefault()
				}
			}
		}
		this.fn_setbutton = function(idBtn,sCaption,iAction,sClass,bHide){
			with(this){
				idBtn.setAttribute("IDA", iAction);
				idBtn.innerHTML = sCaption;
				if(sClass) idBtn.className = sClass;
				idBtn.style.display = (bHide) ? "none" : ""	
			}
		}
		this.fn_setmediaplayerbuttons = function(iState){
			with(this){
				if(iState)
					switch(iState){
						case db_player_stop:
							fn_setbutton(objHeaderMenu_PlayerState,"start<br>afspelen",db_player_start,"clsButtonBrowse");break
						case db_player_start:
							fn_setbutton(objHeaderMenu_PlayerState,"pauzeer<br>afspelen",db_player_pause,"clsButtonBrowse");break
						case db_player_pause:
							fn_setbutton(objHeaderMenu_PlayerState,"hervat<br>afspelen",db_player_resume,"clsButtonBrowse");break
						case db_player_resume:
							fn_setbutton(objHeaderMenu_PlayerState,"pauzeer<br>afspelen",db_player_pause,"clsButtonBrowse");break
					}
				else
					switch(DataCommand.Player.Status)
					{
						case player_stop:
							//fn_page_status("Afspelen is gestopt");
							break
						case player_mediaended:
							//fn_page_status("Het nummer is afgelopen.");
							break
						case player_playing:break
						case player_transitioning:
							// the server mediaplayer is loading the requested song, loop until the player is in player_playing status
							DataCommand.fn_server_sendmediamessage(db_system_status);
							setTimeout(TellaVision.fn_setmediaplayerbuttons(), 1000);
							break
				}
			}
		}
		this.fn_settransitions = function(ID,Property,Duration){
			with(this){
		      	ID.style.webkitTransitionProperty = Property
		      	ID.style.webkitTransitionDuration = Duration + 's';
//				ID.style.webkitTransitionTimingFunction = 'ease-out';
//				ID.style.webkitTransform = 'translate(0, -260px)';
//				ID.style.webkitTransform = 'translate(0, ' + pos + 'px)';
//				ID.style.webkitBackfaceVisibility = ""
			}
		}
		this.fn_transitions = function(bOn){
			with(this){
				if(bOn)
					fn_settransitions(objResultContainer,'top','2')
				else
					fn_settransitions(objResultContainer,'none','')
			}
		}
		this.fn_uistate_update = function(){
			with(this){
				var iHeaderHeight = 20;
				fn_transitions(false);
				if(WL.GetBit(uistate,uistate_landscape)){
//					we're in landscape mode
					objBodyContainerPortrait.style.display = "none";
					objBodyContainerLandscape.style.display = "";
				}else{
//					we're in portrait mode
					objBodyContainerLandscape.style.display = "none";
					objBodyContainerPortrait.style.top = "0px";
					objBodyContainerPortrait.style.display = "";
//					splashlogic
					if(WL.GetBit(uistate,uistate_splash)){
						objResultContainer.style.display = "none";
						objFilter.style.display = "none";
						objResult.className = "clsPortraitBusy"
						uistate = WL.SetBit(uistate,uistate_footer);
						uistate = WL.SetBit(uistate,uistate_results);
					}else{
						objResult.className = "clsPortraitReady"
						objResultContainer.style.display = "";
						objMediaPlayer.style.display = (!WL.GetBit(uistate,uistate_searchmode) && (WL.GetBit(uistate,uistate_mplayer) || WL.GetBit(uistate,uistate_remote))) ? "" : "none";
						objFilter.style.display = "none";
						objMessageContainer.Chatbox.className = "width_10";
						arrMenuButtons[4].style.display = "";
						arrMenuButtons[7].style.display = "none";
						uistate = WL.SetBit(uistate,uistate_footer);
						uistate = WL.SetBit(uistate,uistate_results);
						if(WL.GetBit(uistate,uistate_searchmode)){
							if(WL.GetBit(uistate,uistate_message_execute)){
								fn_setbutton(arrMenuButtons[7],Language.search_submit,uicmd_submit)
								objMessageContainer.Inputbox.className = "width_11";
							}else{
								arrMenuButtons[7].style.display = "none";
								objMessageContainer.Inputbox.className = "width_10";
							}
							objFilter.style.display = "";
							uistate = WL.ResetBit(uistate,uistate_playlist_new);
							uistate = WL.ResetBit(uistate,uistate_playlist_update);
							uistate = WL.ResetBit(uistate,uistate_playlist_delete);
						}
						if(WL.GetBit(uistate,uistate_playlist)){
							objFilter.style.display = "none";
							uistate = WL.SetBit(uistate,uistate_message_chatbox);
//							objMessageContainer.Chatbox.style.display = "";
							objMessageContainer.Chatbox.className = "width_10";
							arrMenuButtons[4].style.display = "";
							arrMenuButtons[7].style.display = "none";
						}						
						if(WL.GetBit(uistate,uistate_playlist_new)){
							objFilter.style.display = "none";
							uistate = WL.ResetBit(uistate,uistate_message_chatbox);
							uistate = WL.SetBit(uistate,uistate_message_inputbox);
//							objMessageContainer.Chatbox.style.display = "none";
							arrMenuButtons[4].style.display = "none";
//							objMessageContainer.Inputbox.style.display = "";
							objMessageContainer.Inputbox.value = Language.playlist_new;
						}						
						if(WL.GetBit(uistate,uistate_playlist_update)){
							objFilter.style.display = "none";
							uistate = WL.ResetBit(uistate,uistate_message_chatbox);
							uistate = WL.SetBit(uistate,uistate_message_inputbox);
//							objMessageContainer.Chatbox.style.display = "none";
							arrMenuButtons[4].style.display = "none";
							arrMenuButtons[7].style.display = "";
							objMessageContainer.Inputbox.value = DataCommand.PageInfo[type_playlist].Current.strTitle;
//							objMessageContainer.Inputbox.style.display = "";
							objMessageContainer.Inputbox.className = "width_01";
							fn_setbutton(arrMenuButtons[7],"update playlist",uicmd_submit)
						}					
						if(WL.GetBit(uistate,uistate_playlist_delete)){
							objFilter.style.display = "none";
							uistate = WL.ResetBit(uistate,uistate_message_chatbox);
//							objMessageContainer.Chatbox.style.display = "";
							objMessageContainer.Chatbox.className = "width_01";
							arrMenuButtons[4].style.display = "none";
							arrMenuButtons[7].style.display = "";
							fn_setbutton(arrMenuButtons[7],"delete playlist",uicmd_submit)
						}
						objMessageContainer.Chatbox.style.display = WL.GetBit(uistate,uistate_message_chatbox) ? "" : "none";
						objMessageContainer.Inputbox.style.display = WL.GetBit(uistate,uistate_message_inputbox) ? "" : "none";
						iHeaderHeight += objHeaderMenu.offsetHeight;
						if(WL.GetBit(uistate,uistate_results)){
							objResult.style.top = objHeaderMenu.offsetTop + objHeaderMenu.offsetHeight + "px";
							if(WL.GetBit(uistate,uistate_footer)){
								objResult.style.height = objFooterMenu.offsetTop - iHeaderHeight + "px";
							}else
								objResult.style.height = (480 - iHeaderHeight) + "px";
							objResult.style.display = ""
						}else{
							objResult.style.display = "none"
						}
						objFooterMenu.style.display = WL.GetBit(uistate,uistate_footer) ? "":"none";
					}
				}
				//fn_setfootermenu();
				fn_transitions(true)
			}
		}
		this.fn_volumesetslider = function(){
			with(this){
				objPlayer_VolumeSwipe.style.left = (-DataCommand.Player.intVolume * volEntryWidth) + "px";
			}
		}
		this.fn_volumeswipe = function(event,touchmode){
			with(this){
				if(touchmode == "transend"){
					intServerVolume = (Math.round(Math.abs(objPlayer_VolumeSwipe.offsetLeft / volEntryWidth)));
					hServerTimer = WL.fn_cleartimer(hServerTimer)
					hServerTimer = setTimeout("DataCommand.fn_server_setvolume(" + intServerVolume + ");",100);
				}else{
					hServerTimer = WL.fn_cleartimer(hServerTimer)
					var touch = event.changedTouches[0]; // Get the information for finger #1
					switch(touchmode){
						case "touchmove":
							//	reset click handler
							bKeyClick = false;
							// calculate target position
							intContainerEndPosition_X = intContainerStartPosition_X - (intFingerStartPosition_X - touch.clientX) * 6;
							// avoiding ending up halfway an entry
							intContainerEndPosition_X = Math.round(intContainerEndPosition_X / volEntryWidth) * volEntryWidth;
							// clip left
							if(intContainerEndPosition_X > 0) intContainerEndPosition_X = 0;
							// clip right
							if(intContainerEndPosition_X < - volEntryWidth * 100) intContainerEndPosition_X = -volEntryWidth * 100;
							// move alphabet street
							objPlayer_VolumeSwipe.style.left = intContainerEndPosition_X + "px";
							break
						case "touchstart":
							// avoid unwanted refreshments
							DataCommand.bSysBusy = true
							// set click logic
							bKeyClick = true;
							// store finger start positions
							intFingerStartPosition_X = parseInt(touch.clientX);
							// store container start positions
							intContainerStartPosition_X = objPlayer_VolumeSwipe.offsetLeft;
							break
						case "touchend":
							if(bKeyClick){
								// reset keyclick flag
								bKeyClick = false;
								switch(touch.target){
									case objPlayer_VolumeMute:
										objPlayer_VolumeSwipe.style.left = "0px";
										break
									case objPlayer_VolumeMax:
										objPlayer_VolumeSwipe.style.left = (-volEntryWidth * 100) + "px";
										break
								}

							}
							break
					}
				}
			}
		}
		this.$ = function(strQuery){
			var objElement = document.querySelector("#" + strQuery)
			return objElement
		}
		this.fn_cache = function(sMsg){
			switch(sMsg){
				case "error" : 	alert(Language.cache_alert_error);
								break
				case "ready" :	alert(Language.cache_alert_ready);
								//objBody = document.querySelector("#dvBody");
								//objBody.style.display = "none";
								//oCache.update();
								//oCache.swapCache();				
								window.location.reload();
								break
				default:		alert("cache" + sMsg);
			}
		}

	}
	var Language = new clsLanguage();
	var Settings = new clsSettings();				//	contains all by server populated application settings
	var WL = new clsWebLibrary();			//	generic function library
	var DataCommand = new clsDbCommand();		//	database ajax layer
	var TellaVision = new clsTellaVision();		//	main navigation & content handling
//	introduce delay to allow the startup splash to become visible
	var oCache = window.applicationCache;
	oCache.addEventListener('updateready', function(event){cacheUpdatereadyListener(event)});
	oCache.addEventListener('error', function(event){cacheErrorListener(event)});
//	window.addEventListener("load", function(event){setTimeout("loadui()",100)}); 
	window.addEventListener("load", function(event){setTimeout("checkHome()",100)}); 
	window.addEventListener("orientationchange", function(event){changeorientation(event)});
	changeorientation = function(hEvent) {TellaVision.fn_orientationchange(true)}
	cacheUpdatereadyListener = function(hEvent) {TellaVision.fn_cache("ready")}
	cacheErrorListener = function(hEvent) {TellaVision.fn_cache("error")}
	
	checkHome = function(){
		if (window.navigator.standalone) 
			loadui()
		else 
			alert(Language.system_nohome)  
	}
	loadui = function(){
		DataCommand.fn_initialize("/xml")
		with(TellaVision){
			
			
		/**********************************************************************************************************************************************************
		/*** busy splash handlers & eventlisteners *******************************************************************************************************************
		/**********************************************************************************************************************************************************/
			objBody = $("dvBody");
			objBody.setAttribute("class",window.orientation == 0 ? "portrait":"landscape");
			//alert(objBody.className)
//			objSplash = $("dvSplashContainer");
//			objSplashMessage = $("dvSplash");
			objMainMenuMessage = $("dvMainMessage");
			objBodyContainerPortrait  = $("dvBodyContainerPortrait");
			objBodyContainerLandscape = $("dvBodyContainerLandscape");

			with(objBodyContainerLandscape){ //fn_headerbuttonhandler
				addEventListener("touchend", function(event){fn_buttonhandler(event,"touchend")},true);
				addEventListener("touchmove", function(event){fn_buttonhandler(event,"touchmove")},true);
				addEventListener("touchstart", function(event){fn_buttonhandler(event,"touchstart")},true);
			}
			
			for(x=0;x<5;x++) arrMainButtons[x] = $("dvMainButton_" + x);
			fn_setbutton(arrMainButtons[0],"",type_void,"clsHideButton") //clsHideButton
			fn_setbutton(arrMainButtons[1],"",type_void,"clsHideButton")
			fn_setbutton(arrMainButtons[2],"verfris",uicmd_refresh)
			fn_setbutton(arrMainButtons[3],"server<br>mode",uistate_remote)
			fn_setbutton(arrMainButtons[4],"uit!",sys_shutdown)
		/**********************************************************************************************************************************************************
		/*** toolbar handlers & eventlisteners ********************************************************************************************************************
		/**********************************************************************************************************************************************************/
			o_titlebar = $("dvAppTitle");
			o_titlebar.innerHTML = "<span style='padding-left:64px;width:200px;'>" + Settings.ServerLanIp + "</span><span style='padding-left:46px;'>terratunes V" + Settings.AppVersion + "</spam>";
		
			objHeaderMenu = $("dvHeaderMenu");
			objHeaderMenuSwipeDiv = $("dvHeaderMenuSwipeDiv");
			with(objHeaderMenu){ //fn_headerbuttonhandler
				addEventListener("touchend", function(event){fn_buttonhandler(event,"touchend")},true);
				addEventListener("touchmove", function(event){fn_buttonhandler(event,"touchmove")},true);
				addEventListener("touchstart", function(event){fn_buttonhandler(event,"touchstart")},true);
			}
			for(x=0;x<8;x++) arrMenuButtons[x] = $("dvMenuButton_" + x);
			fn_setbutton(arrMenuButtons[0],Language.btn_search,uistate_searchmode)
			fn_setbutton(arrMenuButtons[1],Language.btn_playlists,uistate_playlist)
			fn_setbutton(arrMenuButtons[2],Language.btn_history,uistate_history)
			fn_setbutton(arrMenuButtons[3],Language.btn_family,uistate_family)
			fn_setbutton(arrMenuButtons[4],Language.search_targeting_loose,search_targeting_loose)
			fn_setbutton(arrMenuButtons[5],Language.media_all,media_all,"clsKeyBtn")
			fn_setbutton(arrMenuButtons[6],Language.search_clear,db_search_clear)
			fn_setbutton(arrMenuButtons[7],Language.search_submit,uicmd_submit,"clsKeySubmit",true)

			objMediaPlayer = $("dvHeaderMenuContainerMediaPlayer");
			objPlayer_VolumeMute = $("dvMaskLeft");
			objPlayer_VolumeMax = $("dvMaskRight");
			objPlayer_VolumeSwipe = $("dvVolumeSlider");
			for(x=0;x<2;x++) objPlayer_VolumeSwipe.appendChild(fn_createcontainer("div"));
			for(x=0;x<101;x++) objPlayer_VolumeSwipe.appendChild(fn_createcontainer("div",x));
			for(x=0;x<2;x++) objPlayer_VolumeSwipe.appendChild(fn_createcontainer("div"));
			objPlayer_VolumeSwipeBox = $("dvVolumeContainer");
			with(objPlayer_VolumeSwipeBox){
				addEventListener("touchmove", function(event){fn_volumeswipe(event,"touchmove")},true);
				addEventListener("touchstart", function(event){fn_volumeswipe(event,"touchstart")},true);
				addEventListener("touchend", function(event){fn_volumeswipe(event,"touchend")},true);
				addEventListener("webkitTransitionEnd", function(event){fn_volumeswipe(event,"transend")},true);
			}
			objHeaderMenu_PlayerStop	 = $("btnPlayerStop");
			objHeaderMenu_PlayerState = $("btnPlayerPlayPause");
			fn_setbutton(objHeaderMenu_PlayerStop,Language.player_stop,db_player_stop,"clsButtonBrowse")			
			fn_setbutton(objHeaderMenu_PlayerState,Language.player_start,db_player_start,"clsButtonBrowse")			
			
			
			// display toolbar
			objHeaderMenu.style.display = "";
		/**********************************************************************************************************************************************************
		/*** keyboard handlers & eventlisteners *******************************************************************************************************************
		/**********************************************************************************************************************************************************/
			objFilter = $("dvFilter");
//			objFilter.addEventListener("touchmove", function(event){event.preventDefault()},true);
			objFilter.Genre = $("selFilterGenre");
			objFilter.Year = $("selFilterYear");

			with(objFilter.Genre){
//				addEventListener("touchstart", function(event){fn_selecthandler(event,"touchstart")},true);
//				addEventListener("touchmove", function(event){fn_selecthandler(event,"touchmove")},true);
//				addEventListener("touchend", function(event){fn_selecthandler(event,"touchend")},true);
				addEventListener("change", function(event){fn_selecthandler(this)},true);
//				addEventListener("click", function(event){fn_selecthandler(event,"click")},true);
//				addEventListener("blur", function(event){fn_selecthandler(event,"blur")},true);
			}
			with(objFilter.Year){
//				addEventListener("touchstart", function(event){fn_selecthandler(event,"touchstart")},true);
//				addEventListener("touchmove", function(event){fn_selecthandler(event,"touchmove")},true);
//				addEventListener("touchend", function(event){fn_selecthandler(event,"touchend")},true);
				addEventListener("change", function(event){fn_selecthandler(this)},true);
//				addEventListener("click", function(event){fn_selecthandler(event,"click")},true);
//				addEventListener("blur", function(event){fn_selecthandler(event,"blur")},true);
			}

			objMessageContainer = $("dvMessageContainer");
			objMessageContainer.Chatbox = $("dvMessage");
			objMessageContainer.Inputbox = $("inpText");
			with(objMessageContainer.Chatbox){
				addEventListener("touchmove", function(event){event.preventDefault()},true);				
				addEventListener("touchstart", function(event){fn_keyboard(event,"lick")},true);
			}
			with(objMessageContainer.Inputbox){
				addEventListener("touchmove", function(event){event.preventDefault()},true);				
//				addEventListener("touchmove", function(event){fn_keyboard(event,"move")},true);
				addEventListener("change", function(event){fn_keyboard(event,"change")},true);
				addEventListener("click", function(event){fn_keyboard(event,"click")},true);
				addEventListener("blur", function(event){fn_keyboard(event,"blur")},true);
				addEventListener("load", function(event){fn_keyboard(event,"load")},true);
				addEventListener("unload", function(event){fn_keyboard(event,"unload")},true);
				
			}

		/**********************************************************************************************************************************************************
		/*** resultslider handlers & eventlisteners *******************************************************************************************************************
		/**********************************************************************************************************************************************************/
			objResult = $("dvResult");
			with(objResult){
				//addEventListener("webkitTransitionEnd", function(event){DataCommand.bSysBusy = false;if(DataCommand.PageInfo[DataCommand.Control.ClientTypeID].ServerPageCount > 1) fn_setfootermenu(true)},false);
				addEventListener("touchstart", function(event){fn_resultscroller(event,"touchstart")},true);
				addEventListener("touchmove", function(event){fn_resultscroller(event,"touchmove")},true);
				addEventListener("touchend", function(event){fn_resultscroller(event,"touchend")},true);
			}
			objResultContainer = $("dvResultContainer");
			objResultContainer.artists = $("dvArtists");
			objResultContainer.album = $("dvAlbums");
			objResultContainer.songs = $("dvSongs");
			objResultContainer.history = $("dvHistory");
			objResultContainer.playlistsongs = $("dvPlaylistSongs");
			objResultContainer.playlists = $("dvPlaylists");
			objResultContainer.family = $("dvFamily");
//			objResultContainer.genre = $("dvGenre");
			objResultContainer.dialog = $("dvDialog");
			objResultContainer.dialog.addEventListener("touchstart", function(event){strSearchString = "";fn_page_status();},false);//
			objResultContainer.dialog.addEventListener("touchmove", function(event){event.preventDefault()},true)
		/**********************************************************************************************************************************************************
		/*** footer eventlisteners ********************************************************************************************************************************
		/**********************************************************************************************************************************************************/
			objFooterMenu= $("dvFooterMenu");
			with(objFooterMenu){
				addEventListener("touchstart", function(event){fn_buttonhandler(event,"touchstart")},true);
				addEventListener("touchmove", function(event){fn_buttonhandler(event,"touchmove")},true);
				addEventListener("touchend", function(event){fn_buttonhandler(event,"touchend")},true);
			}
			objFooterSwipeDiv = $("dvFooterSwipeDiv");
			for(x=0;x<10;x++) arrFooterButtons[x] = $("dvFooterButton_" + x);
			// uistate_searchmode
			fn_setbutton(arrFooterButtons[0],Language.browse_firstpage,db_browse_firstpage,"clsButtonBrowse")
			fn_setbutton(arrFooterButtons[1],Language.browse_previouspage,db_browse_previouspage,"clsButtonBrowse")
			fn_setbutton(arrFooterButtons[2],Language.uicmd_context,uicmd_context,"clsButtonBlue")
			fn_setbutton(arrFooterButtons[3],Language.browse_nextpage,db_browse_nextpage,"clsButtonBrowse")
			fn_setbutton(arrFooterButtons[4],Language.browse_lastpage,db_browse_lastpage,"clsButtonBrowse")
			fn_setmediaplayerbuttons();
		/**********************************************************************************************************************************************************
		/*** quicktime ********************************************************************************************************************************************
		/**********************************************************************************************************************************************************/
			objQTnext = $("btnQTNext");
			objQTnext.addEventListener("click", function(event){fn_qtnext(event)},true);
			objQTplayer = $("qtPlayer");
			with(objQTplayer){
				addEventListener("qt_canplay",function(event){fn_qtevent('qt_canplay')},true);
				addEventListener("qt_play",function(event){fn_qtevent('qt_play')},true);
				addEventListener("qt_pause",function(event){fn_qtevent('qt_pause')},true);
				addEventListener("qt_timechanged",function(event){fn_qtevent('qt_timechanged')},true);
				addEventListener("qt_error",function(event){fn_qtevent('qt_error')},true);
				addEventListener("qt_begin",function(event){fn_qtevent('qt_begin')},true);
				addEventListener("qt_exitfullscreen",function(event){fn_qtevent('qt_exitfullscreen')},true);
				addEventListener("qt_enterfullscreen",function(event){fn_qtevent('qt_enterfullscreen')},true);
				addEventListener("qt_loadedmetadata",function(event){fn_qtevent('qt_loadedmetadata')},true);
				addEventListener("qt_ended",function(event){fn_qtevent('qt_ended')},true);
			}
			fn_prepopulate(objResultContainer.artists);
			fn_prepopulate(objResultContainer.album);
			fn_prepopulate(objResultContainer.songs);
			fn_prepopulate(objResultContainer.history);
			fn_prepopulate(objResultContainer.playlistsongs);
			fn_prepopulate(objResultContainer.playlists);
			fn_prepopulate(objResultContainer.family);
			//alert('db_browse_year');
			fn_displayresults(db_browse_year,"")
			//alert('db_browse_genre');
			fn_displayresults(db_browse_genre,"")
			fn_displayresults(family_list,"")
			fn_displayresults(db_playlist_list);
			fn_displayresults(db_playlist_list_songs);
			
/*
			uistate = WL.ResetBit(uistate,uistate_searchmode);
			uistate = WL.ResetBit(uistate,uistate_landscape);
			uistate = WL.ResetBit(uistate,uistate_splash);
			uistate = WL.ResetBit(uistate,uistate_select);
			uistate = WL.ResetBit(uistate,uistate_history);
			uistate = WL.ResetBit(uistate,uistate_playlist);
			uistate = WL.ResetBit(uistate,uistate_playlist_new);
			uistate = WL.ResetBit(uistate,uistate_playlist_update);
			uistate = WL.ResetBit(uistate,uistate_playlist_delete);
			uistate = WL.ResetBit(uistate,uistate_keyboard);
			uistate = WL.ResetBit(uistate,uistate_mplayer);
			uistate = WL.ResetBit(uistate,uistate_family);
			uistate = WL.ResetBit(uistate,uistate_message_inputbox);
//			uistate = 0;
*/
			uistate = WL.SetBit(uistate,uistate_message_chatbox);
			uistate = WL.SetBit(uistate,uistate_results);
			uistate = WL.SetBit(uistate,uistate_message);
			uistate = WL.SetBit(uistate,uistate_footer);

			if (DataCommand.Player.Status != 0 && DataCommand.Player.Status != player_stop){
				uistate = WL.SetBit(uistate,uistate_remote)
				fn_displayresults(type_artist);
				fn_displayresults(type_album);
				fn_displayresults(type_song);
				fn_displayresults(type_playlist_song);
//				fn_displayresults(type_family);
				fn_volumesetslider()
				uistate = WL.ResetBit(uistate,uistate_keyboard);
				uistate = WL.SetBit(uistate,uistate_remote);
				uistate = WL.SetBit(uistate,uistate_mplayer);
			}else{
				uistate = WL.ResetBit(uistate,uistate_remote);
				uistate = WL.SetBit(uistate,uistate_playlist);
				WL.addClass(arrMenuButtons[1],"clsHeaderButtonSelected")
				fn_resultselector(type_playlist_song);
				//fn_page_status("Kies een periode beneden.")				
//				fn_displayresults(db_playlist_list,"");
//				if(DataCommand.PageInfo[type_playlist].ServerResultCount == 0) fn_infopane(Language.info_noplaylists);
			}
			//fn_displayresults(type_playlist_song);
			fn_uistate_update();
			// start pingpong timer to keep insync with server
			if(!Settings.bOnWan) setInterval ("TellaVision.fn_pingpong()", 10000);
			//DataCommand.fn_server_sendmediamessage(db_system_status);
			///?71921
			
			fn_transitions(true);
			fn_orientationchange(true);
		}
	}
	
	
