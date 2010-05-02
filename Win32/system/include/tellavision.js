	function clsTellaVision(){
		this.UIwidth = 0;
		this.UIheight = 0;
		this.objBody = new Object;
		/**********************************************************************************************************************************************************
		/*** topmenu  *********************************************************************************************************************************************
		/**********************************************************************************************************************************************************/
		this.objHeaderMenu = new Object;
		this.arrHeaderButtons			= new Array();

		this.objHeaderMenu_Search = new Object;
		this.objHeaderMenu_Playlist = new Object;
		this.objHeaderMenu_History = new Object;
		this.objHeaderMenu_PlayerState = new Object;
		this.objHeaderMenu_PlayerStop = new Object;
		//this.objHeaderMenu_PlayerNext = new Object;
		this.objHeaderMenu_Remote	 = new Object;
		/**********************************************************************************************************************************************************
		/*** keyboard *********************************************************************************************************************************************
		/**********************************************************************************************************************************************************/
		this.objKeyboard = new Object;
		this.objMessage 			= new Object;
		this.objKeyboard_TextPane = new Object;
		this.objKeyboard_Button = new Object;
/*		
		this.objKeyboard_ContainerSwipeBox = new Object;
		this.objKeyboard_SwipeActive = new Object;
		this.objKeyboard_SwipeAlpha = new Object;
		this.objKeyboard_SwipeNumeric = new Object;
		this.objKeyboard_ContainerFilter = new Object;
		this.objKeyboard_ContainerKeyPad = new Object;
		this.objKeyboard_Keypad = new Object;
*/		this.objPageKey = new Object;
		this.strKeyboardCurrentKeyValue = "";
		/**********************************************************************************************************************************************************
		/*** result panes  ****************************************************************************************************************************************
		/**********************************************************************************************************************************************************/
		this.objResult = new Object;
		this.oTouchTarget = new Object;
//		
		/**********************************************************************************************************************************************************
		/*** footer ***********************************************************************************************************************************************
		/**********************************************************************************************************************************************************/
		this.objFooterMenu 				= new Object;
		this.objFooterSwipeDiv	 		= new Object;
		this.arrFooterButtons			= new Array();
		
		/**********************************************************************************************************************************************************
		/*** control vars  ****************************************************************************************************************************************
		/**********************************************************************************************************************************************************/
		this.intUImenu = 0;
		this.intUIcontrol = 0;
		this.strDateSelection = '0:0:0';
		this.hfn_page_status = 0;
		this.hfn_selectpage = 0;
		this.iPPcounter = 0;
		this.iTimes = 1; // used with page nav to allow quick fw/rwd
		this.bConsoleMode = false;
		this.hServerTimer = 0;			
		/**********************************************************************************************************************************************************
		/*** common code snippets *********************************************************************************************************************************
		/**********************************************************************************************************************************************************/
		this.fn_add_option = function(strText,strClass,iAction,iVal){
			with(this)
			{
				var objElement = document.createElement('div');	
				objElement.className = strClass;
				objElement.innerHTML = strText;
				if(iAction != null) objElement.setAttribute("IDA", iAction)
				if(iVal != null) objElement.setAttribute("IDV", iVal);
				return objElement;
			}
		}	
		this.fn_createcontainer = function(strType,strText,strCls){
			var objElement = document.createElement(strType);	
			objElement.className = strCls;
			objElement.innerHTML = strText;
			return objElement;
		}		
		this.fn_create_content = function(recData){
			with(this){
				var listElement = new function(){
					var newObject = document.createElement("DIV");
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
									case type_playlist_song:	newObject.setAttribute("IDX", recData.intStatus + ":" + recData.intColIdx + ":" + recData.intTypeID + ":" + recData.intID + ":" + recData.intServerID + ":" + recData.intArtistID + ":" + recData.lngForeignID + ":" + recData.intBitRate);	break
									case type_user:				break
									case type_year:				newObject.setAttribute("IDX", recData.intStatus + ":" + recData.intColIdx + ":" + recData.intTypeID + ":" + recData.intYear);break
									case type_playlist:			
									case type_genre:			newObject.setAttribute("IDX", recData.intStatus + ":" + recData.intColIdx + ":" + recData.intTypeID + ":" + recData.intID + ":0:0");
																break
									case type_artist:			newObject.setAttribute("IDX", recData.intStatus + ":" + recData.intColIdx + ":" + recData.intTypeID + ":" + recData.intID + ":0:0");
																break
									case type_album:			newObject.setAttribute("IDX", recData.intStatus + ":" + recData.intColIdx + ":" + recData.intTypeID + ":" + recData.intID + ":" + recData.intArtistID + ":0");break
									case type_date:				newObject.setAttribute("IDX", recData.intStatus + ":" + recData.intColIdx + ":" + recData.intTypeID + ":" + recData.intDay + ":" + recData.intMonth + ":" + recData.intYear);break
								}
							}
					newObject.getProperties = function(){with(DataCommand){
								// populates the pageinfo array with the ID's properties 
								var arr_idx = newObject.getAttribute("IDX").split(":"); 
								var ArtistID = 0;
								Control.ClientTypeID = parseInt(arr_idx[2]);					
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
											strSong = newObject.childNodes(0).innerHTML;
											strArtist = newObject.childNodes(2).innerHTML;
										}
										PageInfo[type_artist].Selected.strArtist = PageInfo[Control.ClientTypeID].Selected.strArtist;
										PageInfo[type_artist].Selected.intID = PageInfo[Control.ClientTypeID].Selected.intArtistID;
										break
									case type_year:		PageInfo[type_year].Selected.strYear = newObject.childNodes(0).innerHTML;break
									case type_date:		PageInfo[type_date].Selected.strYear = newObject.childNodes(0).innerHTML;break
									case type_genre:	PageInfo[type_genre].Selected.strGenre = newObject.childNodes(0).innerHTML;break
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
						/*
						switch(recData.intBitRate){
							case 32 : strContent = "32";break
							case 64 : strContent = "64";break
							case 96 : strContent = "96";break
							case 128 : strContent = "128";break
							case 192 : strContent = "192";break
							case 256 : strContent = "256";break
							case 320 : strContent = "320";break
							case 999 : strContent = "flac";break
							default : strContent = "vbr";break
						}
						listElement.appendChild(fn_createcontainer("DIV",strContent,"cls_entry_bitrate"));
						*/
						listElement.appendChild(fn_createcontainer("DIV",recData.strYear,"cls_entry_year"));
						listElement.appendChild(fn_createcontainer("DIV",recData.strArtist,"cls_entry_artist"));
						listElement.appendChild(fn_createcontainer("DIV",recData.strGenre,"cls_entry_genre"));
						listElement.appendChild(fn_createcontainer("DIV",recData.strDuration,"cls_entry_duration"));
						break
					case type_user:
						if(WL.GetBit(recData.intAccessLevel,priv_guest)) 	strContent = "gast"
						if(WL.GetBit(recData.intAccessLevel,priv_user)) 	strContent = "gebruiker"
						if(WL.GetBit(recData.intAccessLevel,priv_family)) 	strContent = "familie"
						if(WL.GetBit(recData.intAccessLevel,priv_owner)) 	strContent = "owner"
						listElement.appendChild(fn_createcontainer("DIV",recData.strFirstName + " " + recData.strLastName,"cls_entry_title"));
						listElement.appendChild(fn_createcontainer("DIV",strContent,"cls_entry_details"));
						break
					case type_playlist:
						listElement.appendChild(fn_createcontainer("DIV",recData.strTitle,"cls_entry_title"));
						listElement.appendChild(fn_createcontainer("DIV",recData.strDescription,"cls_entry_details"));
						break
					case type_genre:
						listElement.appendChild(fn_createcontainer("DIV",recData.strGenre,"cls_entry_title"));
						break
					case type_year:
						if(recData.intYear !=0) listElement.appendChild(fn_createcontainer("DIV",recData.intYear,"cls_entry_title"))
						break
					case type_date:
						if(recData.intYear !=0) listElement.appendChild(fn_createcontainer("DIV",recData.intYear,"cls_entry_date_year"))
						if(recData.intMonth !=0) listElement.appendChild(fn_createcontainer("DIV",WL.MonthName(recData.intMonth),"cls_entry_date_month"))
						if(recData.intDay !=0) listElement.appendChild(fn_createcontainer("DIV",WL.DayName(recData.intDay),"cls_entry_date_day"))
						break
					case type_artist:
						listElement.appendChild(fn_createcontainer("DIV",recData.strArtist,"cls_entry_title"));
						listElement.appendChild(fn_createcontainer("DIV",recData.intAlbumcount + " album" + ((recData.intAlbumcount == 1)?"":"s"),"cls_entry_artist_albumcount"));
						listElement.appendChild(fn_createcontainer("DIV",recData.intSongcount + " liedje" + ((recData.intSongcount == 1)?"":"s"),"cls_entry_artist_songcount"));
						break
					case type_album:
						listElement.appendChild(fn_createcontainer("DIV",recData.strAlbum,"cls_entry_title"));
						listElement.appendChild(fn_createcontainer("DIV",recData.intSongcount + " liedje" + ((recData.intSongcount == 1)?"":"s"),"cls_entry_album_songcount"));
						listElement.appendChild(fn_createcontainer("DIV",recData.strArtist,"cls_entry_album_artistname"));
						break
				}
				return listElement;
			}
		}
		this.fn_currentmedia = function(){
			var strClass="";
			var StatusMessage = "In totaal ";
			with(this){
				with(DataCommand){
					if(WL.GetBit(intUIcontrol,uistatus_playlist)){
						StatusMessage = "Wijzig playlist: " + PageInfo[type_playlist].Selected.strTitle;
					}
					else{
						StatusMessage += PageInfo[Control.ClientTypeID].ServerResultCount
						switch(Control.ClientTypeID)
						{
							case type_playlist:			StatusMessage += " playlists";break
							case type_artist:			StatusMessage += " artiesten";break
							case type_album:			StatusMessage += " albums";break
							case type_song:				StatusMessage += " liedjes";break
							case type_playlist_song:	StatusMessage += " playlist liedjes";break
						}
						StatusMessage += " gevonden";
						if((PageInfo[Control.ClientTypeID].ServerResultCount > 0) && (PageInfo[Control.ClientTypeID].ServerPageIndex > 0))	StatusMessage += ", dit is pagina " + PageInfo[Control.ClientTypeID].ServerPageIndex + " van " + PageInfo[Control.ClientTypeID].ServerPageCount;
					}
					return StatusMessage
				}
			}
		}					
		this.fn_displayresults = function(iDbAction,sSearchString){
			var bReplace = false
			with(this){
				fn_transitions(false)
				with(DataCommand){
					switch(iDbAction){
						case type_artist:
						case type_album:
						case type_song:
						case type_playlist:
						case type_playlist_song:
							Control.ClientTypeID = iDbAction;
							fn_browse_page(0);
							break
						case db_browse_genre:				
							fn_loadgenrepresets();
							fn_page_status("Kies een genres");
							break
						case db_browse_year:
							fn_loadyearpresets();
							fn_page_status("Kies een jaar");
							break
						case db_browse_artist_songs:		
							fn_browse_artist_songs(PageInfo[type_artist].Selected.intID);
							fn_page_status("Kies een artiest liedje");
							break
						case db_browse_artist_albums:		
							fn_browse_artist_albums(PageInfo[type_artist].Selected.intID);
							fn_page_status("Kies een artiest album");
							break
						case db_browse_artist_albums_va:		
							fn_browse_artist_albums_va(PageInfo[type_artist].Selected.intID);
							fn_page_status("Kies een artiest album");
							break
						case db_browse_album_songs:			
							fn_browse_album_songs(PageInfo[type_album].Selected.intID);
							fn_page_status("Kies een album liedje");
							break
						case db_browse_history:
							fn_loadhistorypresets();
							fn_page_status("Kies een maand");
							break
						case db_browse_history_selection:	
							fn_gethistory(sSearchString);
							switch(Control.ServerTypeID){
								case type_artist:	fn_page_status("Dit zijn alle binnen deze periode gevonden artiesten");break
								case type_album:	fn_page_status("Dit zijn alle binnen deze periode gevonden albums");break
								case type_song:		fn_page_status("Dit zijn alle binnen deze periode gevonden liedjes");break
							}
							break
						case db_playlist_list_songs:		
							fn_playlist_list_songs();
							fn_page_status("Kies een playlist liedje");
							break
						case db_playlist_list_albums:		
							fn_playlist_list_albums();
							fn_page_status("Kies een playlist album");
							break
						case db_playlist_list_artists:		
							fn_playlist_list_artists();
							fn_page_status("Kies een playlist artiest");
							break
						case db_playlist_list: 				
							fn_playlist_list();
							fn_page_status("Kies een playlist");
							break
						case db_browse_page:
							bReplace = true;
							iTimes = 1;
							hfn_selectpage = WL.fn_cleartimer(hfn_selectpage);
							fn_browse_page(sSearchString);
							break
					}
					var objTarget = fn_resultselector(Control.ServerTypeID);
					if(colQuery.length != 0){
						if(bReplace){
							// page logic, replace instead of create
							for(intIndex = 0; intIndex < objTarget.childNodes.length; intIndex++){
								if(intIndex < colQuery.length)
									objTarget.replaceChild(fn_create_content(colQuery[intIndex+1]),objTarget.childNodes[intIndex]);
								else
									objTarget.replaceChild(fn_createcontainer("DIV","","cls_type_placeholder"),objTarget.childNodes[intIndex]);
							}
						}else{
							fn_write_content(objTarget,colQuery);
						}
						// only display the pager if pagecount > 1
						if(PageInfo[Control.ServerTypeID].ServerPageCount > 1) fn_setfootermenu(true)
					}
					fn_page_status(fn_currentmedia())
					fn_busy(false);
				}
			}
		}
		this.fn_execute = function(sCmd){
			with(this){
				uistate = WL.SetBit(uistate,uistate_splash);
				fn_uistate_update()
				setTimeout("TellaVision." + sCmd,100);
			}
		}
		this.fn_execute_searchquery = function(strQuery){
			with(this){	
				if(strQuery.length == 0) strQuery = "%%"
				// prepare and execute query
				DataCommand.strMediaSearch = strQuery;
				DataCommand.fn_search_execute();
				// set ui in result mode
//				fn_set_uimode(uimode_results)
				// write content to the appropriate resultdiv
				fn_write_content(fn_resultselector(DataCommand.intSearchFieldType),DataCommand.colQuery);	  //objResultContainer
				fn_page_status(fn_currentmedia())
				// reset busy indicator
				fn_busy(false);
			}
		}				
		this.fn_page_status = function(strMessage){
			with(this){
				if(WL.GetBit(uistate,uistate_searchmode) && (!strMessage)){ //
					switch(DataCommand.intMediaQuality){
						case search_flac: strMsg = "<span class='clsSearchField'>flac</span> ";break
						case search_mp3: strMsg = "<span class='clsSearchField'>mp3</span> ";break
						case search_grps: strMsg = "<span class='clsSearchField'>grps</span> ";break
						case search_all: strMsg = "";break
						
						//case search_all: break
					}
					if(DataCommand.PageInfo[type_genre].Selected.intID != -1){
						strMsg += "<span class='clsSearchField'>" + DataCommand.PageInfo[type_genre].Selected.strGenre + "</span> "
					}				
					switch(DataCommand.intSearchFieldType){
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
					objMessage.innerHTML = strMsg;
				}else{
					if(strMessage)
						objMessage.innerHTML = strMessage;
					else
						objMessage.innerHTML = fn_currentmedia();
				}
			
			}
		}
		this.fn_resultselector = function(ctype){
			with(this){
				var bSelect = WL.GetBit(intUIcontrol,uistatus_playlist)
				// hide all content type sub divs
				objResultContainer.album.style.display = "none";
				objResultContainer.songs.style.display = "none";
				objResultContainer.history.style.display = "none";
				objResultContainer.playlistsongs.style.display = "none";
				objResultContainer.playlists.style.display = "none";
				objResultContainer.artists.style.display = "none";
				objResultContainer.genre.style.display = "none";
				objResultContainer.years.style.display = "none";
				objResultContainer.dialog.style.display = "none";
				if(!bSelect) objResultContainer.style.top = "0px"; 
				if(!isNaN(ctype)){
					DataCommand.Control.ClientTypeID = ctype;
					switch(ctype){
						case type_date:				objResultContainer.current = objResultContainer.history;break
						case type_playlist :		objResultContainer.current = objResultContainer.playlists;break
						case type_playlist_song : 	objResultContainer.current = objResultContainer.playlistsongs;	break
						case type_artist:			objResultContainer.current = objResultContainer.artists;break
						case type_album : 			objResultContainer.current = objResultContainer.album;break
						case type_song : 			objResultContainer.current = objResultContainer.songs;break
						case type_genre : 			objResultContainer.current = objResultContainer.genre;break
						case type_year : 			objResultContainer.current = objResultContainer.years;break
						case type_server : 			objResultContainer.current = objResultContainer.servers;break
					}
				}else{
					objResultContainer.dialog.style.top = "0px";
					objResultContainer.dialog.style.display = "";
					objResultContainer.current = objResultContainer.dialog;
				}
				if(!bSelect) objResultContainer.current.style.top = "0px";
				objResultContainer.current.style.display = "";
				return objResultContainer.current;
			}
		}
		this.fn_selectpage = function(iAction){
			var iPage = 0;
			with(this){
				with(DataCommand.PageInfo[DataCommand.Control.ClientTypeID]){
					//fn_transitions(false)
					fn_busy(true)
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
					if(hfn_selectpage == 0)
					{
						//fn_transitions(true)
						fn_busy(false)
					}
				}
			}
		}
		this.fn_setbutton = function(idBtn,sCaption,iAction,sClass){
			with(this){
				if(iAction!=type_void){
					
					idBtn.setAttribute("IDA", iAction);
				}
				idBtn.innerHTML = sCaption;
				idBtn.className = (sClass) ? sClass:"clsButtonVoid";
			}
		}				
		this.fn_setfootermenu = function(bPager){
			with(this){
				if(bPager) 
					objFooterSwipeDiv.style.left = "-320px";
				else{
					if(WL.GetBit(uistate,uistate_searchmode)){
						objFooterSwipeDiv.style.left = "0px";
					}else{
						if(WL.GetBit(uistate,uistate_playlist)){
							fn_setbutton(arrFooterButtons[10],"toon<br>playlists",db_playlist_list,"clsButtonPlaylist")
							fn_setbutton(arrFooterButtons[11],"verwijder<br>playlist",db_playlist_list_delete,"clsButtonPlaylist");
							fn_setbutton(arrFooterButtons[12],"hernoem<br>playlist",db_playlist_list_update,"clsButtonPlaylist");
							fn_setbutton(arrFooterButtons[13],"nieuwe<br>playlist",db_playlist_list_add,"clsButtonPlaylist");
							fn_setbutton(arrFooterButtons[14],"huidige<br>playlist",db_playlist_list_songs,"clsButtonPlaylist")
							objFooterSwipeDiv.style.left = "-640px";
						}else{
							if(WL.GetBit(uistate,uistate_history)){
								objFooterSwipeDiv.style.left = "-640px";
								fn_setbutton(arrFooterButtons[10],"<br>vandaag",db_browse_history_today,"clsButtonHistory")
								fn_setbutton(arrFooterButtons[11],"<br>gisteren",db_browse_history_yesterday,"clsButtonHistory");
								fn_setbutton(arrFooterButtons[12],"deze<br>week",db_browse_history_week,"clsButtonHistory");
								fn_setbutton(arrFooterButtons[13],"deze<br>maand",db_browse_history_month,"clsButtonHistory");
								fn_setbutton(arrFooterButtons[14],"kies<br>periode",db_browse_history_selection,"clsButtonHistory")
								objFooterSwipeDiv.style.left = "-640px";
							}else{
								objFooterSwipeDiv.style.left = "-640px";
								switch(DataCommand.Control.ClientTypeID){
									case type_date : 
										fn_setbutton(arrFooterButtons[10],"liedjes",type_song,"clsButtonLeftArrow")
										fn_setbutton(arrFooterButtons[11],"alle ooit<br/>beluisterde liedjes",db_browse_history,"OneButton");
										fn_setbutton(arrFooterButtons[12],"",type_void,"");
										fn_setbutton(arrFooterButtons[13],"",type_void,"");
										fn_setbutton(arrFooterButtons[14],"playlists",type_playlist,"clsButtonRightArrow")
										break
									case type_playlist : 
										fn_setbutton(arrFooterButtons[10],"toon<br>playlists",db_playlist_list,"clsButtonPlaylist")
										fn_setbutton(arrFooterButtons[11],"verwijder<br>playlist",db_playlist_list_delete,"clsButtonPlaylist");
										fn_setbutton(arrFooterButtons[12],"hernoem<br>playlist",db_playlist_list_update,"clsButtonPlaylist");
										fn_setbutton(arrFooterButtons[13],"nieuwe<br>playlist",db_playlist_list_add,"clsButtonPlaylist");
										fn_setbutton(arrFooterButtons[14],"huidige<br>playlist",db_playlist_list_songs,"clsButtonPlaylist")
										break
									case type_playlist_song : 
										if(WL.GetBit(uistate,uistate_select))
											fn_setbutton(arrFooterButtons[10],"select<br>mode",uistate_select,"clsButtonSelectOn")
										else
											fn_setbutton(arrFooterButtons[10],"finger<br>mode",uistate_select,"clsButtonSelectOff")
										fn_setbutton(arrFooterButtons[11],"verwijder<br>liedje",db_playlist_list_song_delete,"clsButtonPlaylist");
										fn_setbutton(arrFooterButtons[12],"verwijder<br>album",db_playlist_list_album_delete,"clsButtonPlaylist");
										fn_setbutton(arrFooterButtons[13],"verwijder<br>artiest",db_playlist_list_artist_delete,"clsButtonPlaylist");
										fn_setbutton(arrFooterButtons[14],"",type_void)
										break
									case type_artist:
										if(WL.GetBit(uistate,uistate_select))
											fn_setbutton(arrFooterButtons[10],"select<br>mode",uistate_select,"clsButtonSelectOn")
										else
											fn_setbutton(arrFooterButtons[10],"finger<br>mode",uistate_select,"clsButtonSelectOff")
										fn_setbutton(arrFooterButtons[10],"finger<br>mode",uistate_select,"clsButtonSelectOff")
										fn_setbutton(arrFooterButtons[11],"artiest<br>liedjes",db_browse_artist_songs,"clsButtonArtistSongs");
										fn_setbutton(arrFooterButtons[12],"artiest<br>albums",db_browse_artist_albums,"clsButtonArtistAlbums");
										fn_setbutton(arrFooterButtons[13],"artiest<br>va albums",db_browse_artist_albums_va,"clsButtonArtistVaAlbums");
										fn_setbutton(arrFooterButtons[14],"naar<br>playlist",db_playlist_list_artist_add,"clsButtonAddToPlaylist")
										break
									case type_album : 
										if(WL.GetBit(uistate,uistate_select))
											fn_setbutton(arrFooterButtons[10],"select<br>mode",uistate_select,"clsButtonSelectOn")
										else
											fn_setbutton(arrFooterButtons[10],"finger<br>mode",uistate_select,"clsButtonSelectOff")
										fn_setbutton(arrFooterButtons[11],"artiest<br>liedjes",db_browse_artist_songs,"clsButtonArtistSongs");
										fn_setbutton(arrFooterButtons[12],"artiest<br>albums",db_browse_artist_albums,"clsButtonArtistAlbums");
										fn_setbutton(arrFooterButtons[13],"artiest<br>va albums",db_browse_artist_albums_va,"clsButtonArtistVaAlbums");
										fn_setbutton(arrFooterButtons[14],"naar<br>playlist",db_playlist_list_album_add,"clsButtonAddToPlaylist")
										break
									case type_song : 
										if(WL.GetBit(uistate,uistate_select))
											fn_setbutton(arrFooterButtons[10],"select<br>mode",uistate_select,"clsButtonSelectOn")
										else
											fn_setbutton(arrFooterButtons[10],"finger<br>mode",uistate_select,"clsButtonSelectOff")
										fn_setbutton(arrFooterButtons[11],"artiest<br>liedjes",db_browse_artist_songs,"clsButtonArtistSongs");
										fn_setbutton(arrFooterButtons[12],"artiest<br>albums",db_browse_artist_albums,"clsButtonArtistAlbums");
										fn_setbutton(arrFooterButtons[13],"artiest<br>va albums",db_browse_artist_albums_va,"clsButtonArtistVaAlbums");
										fn_setbutton(arrFooterButtons[14],"naar<br>playlist",db_playlist_list_song_add,"clsButtonAddToPlaylist")
										break
/*									case type_genre : 
										fn_setbutton(arrFooterButtons[10],"",type_void);
										fn_setbutton(arrFooterButtons[11],"",type_void);
										fn_setbutton(arrFooterButtons[12],"",type_void);
										fn_setbutton(arrFooterButtons[13],"",type_void);
										fn_setbutton(arrFooterButtons[14],"",type_void);
										break
									case type_year :
										fn_setbutton(arrFooterButtons[10],"",type_void);
										fn_setbutton(arrFooterButtons[11],"",type_void);
										fn_setbutton(arrFooterButtons[12],"",type_void);
										fn_setbutton(arrFooterButtons[13],"",type_void);
										fn_setbutton(arrFooterButtons[14],"",type_void);
										break
									case type_server :
										fn_setbutton(arrFooterButtons[10],"",type_void);
										fn_setbutton(arrFooterButtons[11],"",type_void);
										fn_setbutton(arrFooterButtons[12],"",type_void);
										fn_setbutton(arrFooterButtons[13],"",type_void);
										fn_setbutton(arrFooterButtons[14],"",type_void);
										break
*/
							}
							}
						}
					}
				}
			}
		}	
		this.fn_uistate_update = function(){
			with(this){
				var iHeaderHeight = 0;
				var iContentHeight = 0;
				var iFooterHeight =0;
				fn_transitions(false)
				if(WL.GetBit(uistate,uistate_landscape)){
//					we're in landscape mode
					objBodyContainerPortrait.style.display = "none";
					objBodyContainerLandscape.style.display = "";
				}else{
//					we're in portrait mode
					objBodyContainerLandscape.style.display = "none";
					objBodyContainerPortrait.style.display = "";
//					splashlogic
					if(WL.GetBit(uistate,uistate_splash)){
						with(objSplash.style){
							top = objResult.offsetTop + 8 + "px"; 
							height = objResult.offsetHeight - 20 + "px"; 
							display = "";
						}					
					}else{
						objSplash.style.display = "none";
						if(WL.GetBit(uistate,uistate_headermenu)){
							objHeaderMenu.style.display = "";
							if(WL.GetBit(uistate,uistate_mplayer) || WL.GetBit(uistate,uistate_remote)){
								objMediaPlayer.style.display = "";
								iHeaderHeight = 134;
							}else{
								objMediaPlayer.style.display = "none";
								iHeaderHeight = 78;
							}					
						}else{
							objHeaderMenu.style.display = "none";
							iHeaderHeight = 78;
						}

						if(WL.GetBit(uistate,uistate_message)){
							objMessage.style.display = "";
							objMessage.style.top = iHeaderHeight + "px";
							iHeaderHeight += 24;
						}else{
							objMessage.style.display = "none";
						}
						
						if(WL.GetBit(uistate,uistate_keyboard)){
							objKeyboard.style.display = "";
							objKeyboard.style.top = iHeaderHeight - 4 + "px";
							objMessage.className = "clsMessageWithKeyboard";
							iHeaderHeight += 46;
						}else{
							objMessage.className = "clsMessageNoKeyboard";
							objKeyboard.style.display = "none";
						}
						
						
						
						objFooterMenu.style.display = (WL.GetBit(uistate,uistate_footer)) ? "":"none";
						if(WL.GetBit(uistate,uistate_results)){
							objResult.style.display = ""
							objResult.style.top = iHeaderHeight + "px";
							objResult.style.height = objFooterMenu.offsetTop - iHeaderHeight + "px"; 
						}else{
							objResult.style.display = "none"
						}
					}
				}
				fn_setfootermenu();
				fn_transitions(true)
			}		
		}
		this.fn_write_content = function(objTarget,colData){
			with (this){
				//objTarget.innerHTML = (colData.length==0) ? "<div class='clsNoResults'><div class='clsEyes'></div>Koekeloer heeft<br/>nix gevonden</div>":"";
				objTarget.innerHTML = "";
				for(intIndex = 1; intIndex <= colData.length; intIndex++) objTarget.appendChild(fn_create_content(colData[intIndex]));
				iPPcounter = 0;
				fn_busy(false);
				//fn_set_uimode(uimode_results)
			}
		}

		
