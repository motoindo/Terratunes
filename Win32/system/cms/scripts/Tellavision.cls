	function clsTellaVision()
	{
		/**********************************************************************************************************************************************************
		/*** CONTROL VARIABLES ************************************************************************************************************************************
		/**********************************************************************************************************************************************************/
	
		this.MenuMode = menu_playlist;
		this.LastMenuMode = menu_playlist;		//	used to return to the current menu after a search has been performed
		this.OpMode = opmode_usermode;
		this.PlayerState = 0;

		this.intActiveCollection = 0; // 0:dbPlayList,
		this.bUIready = true;
//		this.bShowBGimg = true;
		this.idxSelected = 0;
		this.intEntryHeight = 0;	
		this.intEntryWidth = 0;	
		this.strItemClass = '';
		this.intScrollSize = 0;
		this.strAlbumArtFolder = '';
		this.hfn_process_searchquery = 0;
//		this.strTarget_Content_Class = "";
		//this.strEntryClass = "";
		this.strSearchEntryClass = "cls_search_entry";

		/**********************************************************************************************************************************************************
		/*** OBJECTS **********************************************************************************************************************************************
		/**********************************************************************************************************************************************************/

		this.objTopMenu = new Object;
		this.objBodyContainer = new Object;
		this.objWebKeyboard = new Object;
		this.objSideMenu = new Object;
		this.objSystemStatus = new Object;
		this.objFlashplayer = new Object;
		this.objTarget_Content_Container = new Object;
		this.objTarget_Content = new Object;
		this.objTarget_Content_CurrentItem = new Object;
		this.objTarget_Content_SelectedItem = new Object;
		this.objTarget_Content_ClickedItem = new Object;
		this.objSearchTerm = new Object;
		this.objPlayerTimer = new Object;
		this.objVolume = new Object;
		this.objVolumeScroller = new Object;
		this.intControlBarButtonWidth = 0;
		this.intControlBarButtonHeight = 0;
		/**********************************************************************************************************************************************************
		/***  KEYBOARD ********************************************************************************************************************************************
		/**********************************************************************************************************************************************************/
		this.bCapsLock = false;
		this.bKeyboard_Visible = false;
		this.bShiftLock = false;
		this.intSearchTargetingMode = search_targeting_begin;		
		
		/**********************************************************************************************************************************************************
		/***  QuerySubMenu ****************************************************************************************************************************************
		/**********************************************************************************************************************************************************/

		this.objQuerySubMenuContainer = new Object;
		this.objQuerySubMenuUser = new Object;
		this.objQuerySubMenuPlaylist = new Object;
		this.objQuerySubMenuArtist = new Object;
		this.objQuerySubMenuAlbum = new Object;
		this.objQuerySubMenuGenre = new Object;
		this.objQuerySubMenuYear = new Object;
		this.objQuerySubMenu = new Object;
		

		/**********************************************************************************************************************************************************
		/***  CODE ************************************************************************************************************************************************
		/**********************************************************************************************************************************************************/

		this.fn_initialize = function (iMenuID)
		{
			with(this)
			{
				fn_create_controlbar(objTopMenu);
				fn_create_playscroller(objPlayerTimer);
				fn_create_volumecontrol(objVolume,objVolumeScroller);
				intScreenWindowHeight = parseInt(objTarget_Content_Container.offsetHeight);
				switch(DataCommand.recWork.intAccessLevel)
				{
					case priv_guest : 	fn_system_message('Gast [' + DataCommand.recWork.strIPadress + ']');break
					case priv_user : 	fn_system_message(DataCommand.recWork.strFirstName + ' ' + DataCommand.recWork.strLastName + ' [gebruiker]');break
					case priv_friend :	fn_system_message(DataCommand.recWork.strFirstName + ' ' + DataCommand.recWork.strLastName + ' [vriend]');break
					case priv_partner :	fn_system_message(DataCommand.recWork.strFirstName + ' ' + DataCommand.recWork.strLastName + ' [partner]');break
					case priv_owner :	fn_system_message(DataCommand.recWork.strFirstName + ' ' + DataCommand.recWork.strLastName + ' [eigenaar]');break
					case priv_admin :	fn_system_message(DataCommand.recWork.strFirstName + ' ' + DataCommand.recWork.strLastName + ' [gebruiker]');break
				}
				WebLib.AddEvent(objTarget_Content,"mousedown",function (event){fn_container_mouse_down(event)},false);
				WebLib.AddEvent(objTarget_Content,"mouseup",function(event){fn_container_mouse_up(event)},false);
				//WebLib.AddEvent(objTarget_Content,"mousemove",function(event){fn_container_mouse_move(event)},false);
				//fn_set_menu($("button_menu_playlists"))
			}
		}			
		
		/**********************************************************************************************************************************************************
		/*** TOPBAR LOGIC  ****************************************************************************************************************************************
		/**********************************************************************************************************************************************************/
			
		this.Dimmer = function(iVal)
		{
			with(this)
			{
				if(iVal < 16)
				objBodyContainer.style.backgroundColor = "#0" + iVal.toString(16) + "0" + iVal.toString(16) + "0" + iVal.toString(16)
				else
				objBodyContainer.style.backgroundColor = "#" + iVal.toString(16) + iVal.toString(16) + iVal.toString(16)
			}
		}

		this.addButton = function(idTarget,strClassName,intUIhandler,strBtnCaption,iWidth,iHeight)
		{
			with(this)
			{
				var aElement = document.createElement("DIV");
				var bElement = document.createElement("DIV");
				aElement.id = "button_" + WebLib.GetIdString(intUIhandler);
				aElement.className = strClassName;
				aElement.style.height = iHeight.toString() + "px";
				aElement.style.width = iWidth.toString() + "px";
				aElement.iProcID = intUIhandler;
				aElement.unleak_onmousedown = function(event){fn_set_menu(aElement)};
				WebLib.AddEvent(aElement,"mousedown",function (event){aElement.unleak_onmousedown(event)},false);//listElement.unleak_onmousedown
				bElement.innerHTML = strBtnCaption;
				bElement.className = "clsButton_Image";
				bElement.id = "btn_" + WebLib.GetIdString(intUIhandler);
				aElement.appendChild(bElement);
				idTarget.appendChild(aElement);
			}
		}
		
		
		this.addSubMenuButton = function(idTarget,strClassName,intUIhandler,strBtnCaption)
		{
			with(this)
			{
				var aElement = document.createElement("DIV");
				aElement.id = "button_" + WebLib.GetIdString(intUIhandler);
				aElement.className = strClassName;
				aElement.iProcID = intUIhandler;
				aElement.unleak_onmousedown = function(event){fn_set_submenu(aElement)};
				WebLib.AddEvent(aElement,"mousedown",function (event){aElement.unleak_onmousedown(event)},false);//listElement.unleak_onmousedown
				aElement.innerHTML = strBtnCaption;
				idTarget.appendChild(aElement);
			}
		}
		
		
		this.fn_create_controlbar = function(idTarget)
		{
			with(this)
			{
//				addButton(idTarget,"clsButton_ControlBar",menu_playlists,"playlists",intControlBarButtonWidth,intControlBarButtonHeight);
				addButton(idTarget,"clsButton_ControlBar",menu_history,"lokaal",intControlBarButtonWidth,intControlBarButtonHeight);
				addButton(idTarget,"clsButton_ControlBar",menu_search,"zoeken",intControlBarButtonWidth,intControlBarButtonHeight);
//				addButton(idTarget,"clsButton_ControlBar",menu_genre,"genres",intControlBarButtonWidth,intControlBarButtonHeight);
				addButton(idTarget,"clsButton_ControlBar",menu_playlist,"speelt nu",intControlBarButtonWidth,intControlBarButtonHeight);
//				addButton(idTarget,"clsButton_ControlBar",menu_restart,"restart",intControlBarButtonWidth,intControlBarButtonHeight);

				addButton(idTarget,"clsButton_ControlBar",player_previous,"vorige",intControlBarButtonWidth,intControlBarButtonHeight);
				addButton(idTarget,"clsButton_ControlBar",player_stop,"stop",intControlBarButtonWidth,intControlBarButtonHeight);
				addButton(idTarget,"clsButton_ControlBar",player_start,"speel",intControlBarButtonWidth,intControlBarButtonHeight);
				addButton(idTarget,"clsButton_ControlBar",player_next,"volgende",intControlBarButtonWidth,intControlBarButtonHeight);
				
				addSubMenuButton(objSideMenu,"cls_current_button",type_playlist,"playlist");
				addSubMenuButton(objSideMenu,"cls_current_button",type_genre,"genre");
				addSubMenuButton(objSideMenu,"cls_current_button",type_artist,"artiest");
				addSubMenuButton(objSideMenu,"cls_current_button",type_album,"album");
				addSubMenuButton(objSideMenu,"cls_current_button",type_song,"liedje");
				addSubMenuButton(objSideMenu,"cls_current_button",type_year,"jaartal");
			}
		}		
		

		this.fn_system_message = function(strMessage)
		{
			this.objSystemStatus.innerHTML = strMessage;
		}

		this.fn_search_term = function(strMessage)
		{
			this.objSearchTerm.innerHTML = strMessage;
		}

		this.updateCollectionSortOrder = function()
		{
			with(this)
			{
				for(iQCn = 0; iQCn < objTarget_Content.childNodes.length; iQCn++)
				{
					DataCommand.dbQuery[objTarget_Content.childNodes(iQCn).intIndex].intTrackID = iQCn;
				}
				DataCommand.intActiveCollection = collection_playlist;
				DataCommand.fn_execute_searchquery(db_playlist_list_update);
				fn_system_message("De afspeel volgorde van de <strong>" + DataCommand.strPlaylist + "</strong> playlist is succesvol opgeslagen")
			}
		}

		this.fn_set_selected_item = function(ID)
		{
			with(this)
			{
				if(MenuMode == menu_playlist)
				{
					if(WebLib.GetBit(ID.iStat,status_selected))
						ID.iStat = WebLib.ResetBit(ID.iStat,status_selected);
					else
						ID.iStat = WebLib.SetBit(ID.iStat,status_selected);
					DataCommand.colPlaylist[ID.idx].intStatus = ID.iStat;
					setItemClass(ID);
				}
				else
				{
					if(WebLib.GetBit(ID.iStat,status_selected))
						ID.iStat = WebLib.ResetBit(ID.iStat,status_selected);
					else
						ID.iStat = WebLib.SetBit(ID.iStat,status_selected);
					setItemClass(ID);
				}
				objTarget_Content_SelectedItem = ID;
				var objDataSet = DataCommand.recSelected.Data;
				switch(ID.iType)
				{
					case type_artist : 
						objDataSet.intArtistID = ID.intID;
						//$("button_type_artist").style.backgroundImage = "url(/streamer/image.asp?f=" + objDataSet.strArtist.replace(" ","") + "&q=99&w=60&h=60)";
						//$("button_type_album").style.backgroundImage = "url(/streamer/image.asp?f=" + objDataSet.strAlbum.replace(" ","") + "&q=99&w=60&h=60)";
						break
					case type_album : 
						objDataSet.intAlbumID = ID.intID;
						//$("button_type_artist").style.backgroundImage = "url(/streamer/image.asp?f=" + objDataSet.strArtist.replace(" ","") + "&q=99&w=60&h=60)";
						//$("button_type_album").style.backgroundImage = "url(/streamer/image.asp?f=" + objDataSet.strAlbum.replace(" ","") + "&q=99&w=60&h=60)";
						break
					case type_song : 
						objDataSet.intSongID = ID.intID;
						//$("button_type_artist").style.backgroundImage = "url(/streamer/image.asp?f=" + objDataSet.strArtist.replace(" ","") + "&q=99&w=60&h=60)";
						//$("button_type_album").style.backgroundImage = "url(/streamer/image.asp?f=" + objDataSet.strAlbum.replace(" ","") + "&q=99&w=60&h=60)";
						break
					case type_user : 
						objDataSet.intUserID = ID.intID;
						//$("button_type_user").style.backgroundImage = "url(/streamer/image.asp?type=" + ID.iType + "&id=" + ID.intID + "&q=99&w=60&h=60)";
						break
					case type_playlist : 
						objDataSet.intPlaylistID = ID.intID;
						//$("button_type_playlist").style.backgroundImage = "url(/streamer/image.asp?f=playlist_" + ID.intID + "&q=99&w=60&h=60)";
						break
					case type_genre : 
						objDataSet.intGenreID = ID.intID;
						//$("button_type_genre").style.backgroundImage = "url(/streamer/image.asp?f=genre_" + ID.intID + "&q=99&w=60&h=60)";
						break
					case type_year : 
						objDataSet.intYear = ID.intID;
						$("button_type_year").innerHTML = ID.intID;
						break
				}
			}
		}
		
		this.fn_set_current_item = function(ID)
		{
			with(this)
			{
				var idx = 0;
				//alert('fn_set_current_item');
				if(ID != objTarget_Content_CurrentItem)
				{	// reset objTarget_Content_CurrentItem
					idx = parseInt(objTarget_Content_CurrentItem.idx)
					//alert(idx);
					DataCommand.colPlaylist[idx].intStatus = WebLib.ResetBit(DataCommand.colPlaylist[idx].intStatus,status_current);
					objTarget_Content_CurrentItem.iStat = DataCommand.colPlaylist[idx].intStatus;
					setItemClass(objTarget_Content_CurrentItem);
				}
				// switch objTarget_Content_CurrentItem with ID
				objTarget_Content_CurrentItem = ID
				idx = parseInt(objTarget_Content_CurrentItem.idx)
				DataCommand.colPlaylist[idx].intStatus = WebLib.SetBit(DataCommand.colPlaylist[idx].intStatus,status_current);
				objTarget_Content_CurrentItem.iStat = DataCommand.colPlaylist[idx].intStatus
				DataCommand.recCurrent.Data = DataCommand.colPlaylist[idx].clone()
				setItemClass(objTarget_Content_CurrentItem);
				// scroll currentitem into view
				intTargetEndPosition = -objTarget_Content_CurrentItem.offsetTop;
				fn_container_move(true)
				var objDataSet = DataCommand.recCurrent.Data;
				switch(ID.iType)
				{
					case type_artist : 
						objDataSet.intArtistID = ID.intID;
						//$("button_type_artist").style.backgroundImage = "url(/streamer/image.asp?f=" + WebLib.DeSpace(objDataSet.strArtist) + "&q=99&w=60&h=60)";
						//$("button_type_album").style.backgroundImage = "url(/streamer/image.asp?f=" + WebLib.DeSpace(objDataSet.strArtist + "-" + objDataSet.strAlbum) + "&q=99&w=60&h=60)";
						break
					case type_album : 
						objDataSet.intAlbumID = ID.intID;
						//$("button_type_artist").style.backgroundImage = "url(/streamer/image.asp?f=" + WebLib.DeSpace(objDataSet.strArtist) + "&q=99&w=60&h=60)";
						//$("button_type_album").style.backgroundImage = "url(/streamer/image.asp?f=" + WebLib.DeSpace(objDataSet.strArtist + "-" + objDataSet.strAlbum) + "&q=99&w=60&h=60)";
						break
					case type_song : 
						objDataSet.intSongID = ID.intID;
						//$("button_type_artist").style.backgroundImage = "url(/streamer/image.asp?f=" + WebLib.DeSpace(objDataSet.strArtist) + "&q=99&w=60&h=60)";
						//$("button_type_album").style.backgroundImage = "url(/streamer/image.asp?f=" + WebLib.DeSpace(objDataSet.strArtist + "-" + objDataSet.strAlbum) + "&q=99&w=60&h=60)";
						break
					case type_user : 
						objDataSet.intUserID = ID.intID;
						//$("button_type_user").style.backgroundImage = "url(/streamer/image.asp?type=" + ID.iType + "&id=" + ID.intID + "&q=99&w=60&h=60)";
						break
					case type_playlist : 
						objDataSet.intPlaylistID = ID.intID;
						//$("button_type_playlist").style.backgroundImage = "url(/streamer/image.asp?f=playlist_" + ID.intID + "&q=99&w=50&h=50)";
						break
					case type_genre : 
						objDataSet.intGenreID = ID.intID;
						//$("button_type_genre").style.backgroundImage = "url(/streamer/image.asp?f=genre_" + ID.intID + "&q=99&w=60&h=60)";
						break
					case type_year : 
						objDataSet.intYear = ID.intID;
						$("button_type_year").innerHTML = ID.intID;
						break
				}
			}
		}
		
		
		this.fn_play_previous_entry = function()
		{
			with(this)
			{
				// switch UI to menu_playlist if current menumode is not menu_playlist
				if(MenuMode != menu_playlist) fn_set_menu($("button_menu_playlist"))
				if(objTarget_Content_CurrentItem.previousSibling != undefined)
				{
				intFingerDelta = 1;
				fn_set_current_item(objTarget_Content_CurrentItem.previousSibling)
				}
			}
		}		

		this.fn_play_next_entry = function()
		{
			with(this)
			{
				// switch UI to menu_playlist if current menumode is not menu_playlist
				if(MenuMode != menu_playlist) fn_set_menu($("button_menu_playlist"))
				if(objTarget_Content_CurrentItem.nextSibling != undefined)
				{
				intFingerDelta = -1;
				fn_set_current_item(objTarget_Content_CurrentItem.nextSibling)
				}
				else
				{
				intFingerDelta = 1;
				fn_set_current_item(objTarget_Content.childNodes[0])
				}
			}
		}		

		this.fn_set_submenu = function(ID)
		{
			with(this)			// submenu height: 440
			{
				switch(MenuMode)
				{
					case menu_search:
						DataCommand.intSearchFieldType = ID.iProcID;
						fn_process_searchquery(strKeyString);
						break
					case menu_history:
						switch(ID.iProcID)
						{
							case type_genre:
								fn_system_message("TellaVision.fn_set_submenu: " + WebLib.GetIdString(MenuMode) + "-" + WebLib.GetIdString(ID.iProcID));
								break
							case type_playlist:
								fn_system_message("TellaVision.fn_set_submenu: " + WebLib.GetIdString(MenuMode) + "-" + WebLib.GetIdString(ID.iProcID));
								break
							case type_song:
								DataCommand.fn_browse_history_songs(DataCommand.recWork.intUserID);
								fn_write_content(objTarget_Content,DataCommand.colQuery)
								break						
							case type_artist:
								DataCommand.fn_browse_history_artists(DataCommand.recWork.intUserID);
								fn_write_content(objTarget_Content,DataCommand.colQuery)
								break
							case type_album:
								DataCommand.fn_browse_history_albums(DataCommand.recWork.intUserID);
								fn_write_content(objTarget_Content,DataCommand.colQuery)
								break
							case type_year:
								fn_system_message("TellaVision.fn_set_submenu: " + WebLib.GetIdString(MenuMode) + "-" + WebLib.GetIdString(ID.iProcID));
								break
						}
						break
					case menu_playlist:
						switch(ID.iProcID)
						{
							case type_genre:
								fn_system_message("TellaVision.fn_set_submenu: " + WebLib.GetIdString(MenuMode) + "-" + WebLib.GetIdString(ID.iProcID));
								break
							case type_playlist:
								DataCommand.fn_playlist_list(DataCommand.recWork.intUserID)
								fn_write_content(objTarget_Content,DataCommand.colQuery);		
								MenuMode = ID.iProcID	
								break
							case type_song:
								fn_system_message("TellaVision.fn_set_submenu: " + WebLib.GetIdString(MenuMode) + "-" + WebLib.GetIdString(ID.iProcID));
								break						
							case type_artist:
								fn_system_message("DataCommand.recCurrent.Data.intArtistID : " + DataCommand.recCurrent.Data.intArtistID);
								DataCommand.fn_browse_artist_albums(DataCommand.recCurrent.Data.intArtistID)
								fn_write_content(objTarget_Content,DataCommand.colQuery)
								break
							case type_album:	
								DataCommand.fn_browse_album_songs(DataCommand.recCurrent.Data.intAlbumID)
								fn_write_content(objTarget_Content,DataCommand.colQuery)
								break
							case type_year:
								if(DataCommand.recCurrent.Data.strYear !='')
								{
									DataCommand.fn_browse_song_year(DataCommand.recCurrent.Data.strYear)
									fn_write_content(objTarget_Content,DataCommand.colQuery)
								}
								else
									fn_system_message("TellaVision.fn_set_submenu: " + WebLib.GetIdString(MenuMode) + "-" + WebLib.GetIdString(ID.iProcID));
								break
						}
						break
					case menu_playlists:
						switch(ID.iProcID)
						{
							case type_genre:
								fn_system_message("TellaVision.fn_set_submenu: " + WebLib.GetIdString(MenuMode) + "-" + WebLib.GetIdString(ID.iProcID));
								break
							case type_playlist:
								DataCommand.fn_playlist_list(DataCommand.recWork.intUserID)
								fn_write_content(objTarget_Content,DataCommand.colQuery);		
								MenuMode = ID.iProcID	
								break
							case type_song:
								fn_system_message("TellaVision.fn_set_submenu: " + WebLib.GetIdString(MenuMode) + "-" + WebLib.GetIdString(ID.iProcID));
								break						
							case type_artist:
								fn_system_message("TellaVision.fn_set_submenu: " + WebLib.GetIdString(MenuMode) + "-" + WebLib.GetIdString(ID.iProcID));
								break
							case type_album:	
								fn_system_message("TellaVision.fn_set_submenu: " + WebLib.GetIdString(MenuMode) + "-" + WebLib.GetIdString(ID.iProcID));
								break
							case type_year:
								fn_system_message("TellaVision.fn_set_submenu: " + WebLib.GetIdString(MenuMode) + "-" + WebLib.GetIdString(ID.iProcID));
								break
						}
						break
					default: fn_system_message("TellaVision.fn_set_submenu: unhandled menumode : " + WebLib.GetIdString(MenuMode));
				}
			}
		}

		this.fn_set_menu = function(ID)
		{
			var objChild = Object;
			with(this)
			{
				intScrollSize = objTarget_Content.scrollHeight;
				
				//$("button_menu_playlists").className = "clsButton_ControlBar";
				$("button_menu_history").className = "clsButton_ControlBar";
				$("button_menu_search").className = "clsButton_ControlBar";
				//$("button_menu_genre").className = "clsButton_ControlBar";
				$("button_menu_playlist").className = "clsButton_ControlBar";
				
				switch(ID.iProcID)
				{
/*
					case menu_opmode_playlist:
						if(WebLib.GetBit(OpMode,opmode_playlistmode)) 
							OpMode = WebLib.ResetBit(OpMode,opmode_playlistmode);
						else
							OpMode = WebLib.SetBit(OpMode,opmode_playlistmode);
						//fn_set_contextmenu(MenuMode);
						break
*/
					case menu_search:
						if(MenuMode == menu_search)
						{
							MenuMode = LastMenuMode;	
							objTarget_Content_Container.style.height = "";
							intTargetScrollRowHeight = 222;
							objWebKeyboard.style.display = "none";
							fn_write_content(objTarget_Content,DataCommand.colQuery);		
							fn_set_menu($("button_" + WebLib.GetIdString(LastMenuMode)))
						}
						else
						{
//							fn_clear_keyboard();
							LastMenuMode = MenuMode;
							MenuMode = menu_search	
							objTarget_Content_Container.style.height = "174px";
							intTargetScrollRowHeight = 88;
							objWebKeyboard.style.display = "";
//							fn_write_content(objTarget_Content,DataCommand.colQuery);		
//							fn_search_term("Geef uw zoekopdracht:");
						}
						break

					case menu_genre:
						DataCommand.fn_browse_genre()
						fn_write_content(objTarget_Content,DataCommand.colQuery);		
						MenuMode = ID.iProcID	
						//fn_set_contextmenu(MenuMode);
						break
					case menu_history:
						DataCommand.fn_browse_history_artists(DataCommand.recWork.intUserID);
						fn_write_content(objTarget_Content,DataCommand.colQuery);		
						MenuMode = ID.iProcID	
						//fn_set_contextmenu(MenuMode);
						break
					case menu_playlists:
						DataCommand.fn_playlist_list(DataCommand.recWork.intUserID)
						fn_write_content(objTarget_Content,DataCommand.colQuery);		
						MenuMode = ID.iProcID	
						//fn_set_contextmenu(MenuMode);
						break			
					case menu_playlist:
						fn_write_content(objTarget_Content,DataCommand.colPlaylist);		
						MenuMode = ID.iProcID	
						//fn_set_contextmenu(MenuMode);
						break
					case player_next:
						$("button_player_next").className = "clsButton_ControlBarSelected";
						$("button_player_previous").className = "clsButton_ControlBar";
						$("button_player_start").className = "clsButton_ControlBar";
						$("button_player_stop").className = "clsButton_ControlBar";
						fn_play_next_entry();
						fn_update_playscroller(0)
						FlashPlayer.Load(objTarget_Content_CurrentItem.intID)
						FlashPlayer.mpPlay();
						setTimeout("button_player_next.className='clsButton_ControlBar';button_player_start.className='clsButton_ControlBarSelected'",2000);
						break
					case player_previous:
						$("button_player_next").className = "clsButton_ControlBar";
						$("button_player_previous").className = "clsButton_ControlBarSelected";
						$("button_player_start").className = "clsButton_ControlBar";
						$("button_player_stop").className = "clsButton_ControlBar";
						fn_play_previous_entry();
						fn_update_playscroller()
						FlashPlayer.Load(objTarget_Content_CurrentItem.intID)
						FlashPlayer.mpPlay();
						setTimeout("button_player_previous.className='clsButton_ControlBar';button_player_start.className='clsButton_ControlBarSelected'",2000);
						break
					case player_start:
						$("button_player_start").className = "clsButton_ControlBarSelected";
						$("button_player_stop").className = "clsButton_ControlBar";
						objTarget_Content_CurrentItem = objTarget_Content_SelectedItem
						fn_set_current_item(objTarget_Content_CurrentItem)
						FlashPlayer.Load(objTarget_Content_CurrentItem.intID)
						FlashPlayer.mpPlay();
						var hButton = $("btn_" + WebLib.GetIdString(player_start));
						switch(FlashPlayer.currentstate)
						{
							case 0:	// paused
									hButton.style.backgroundImage = "url(/resources/skins/touch/images/btn_" + WebLib.GetIdString(player_resume) + ".gif)";
									hButton.innerHTML = "start";
									break
							case 2: // playing
									hButton.style.backgroundImage = "url(/resources/skins/touch/images/btn_" + WebLib.GetIdString(player_start) + ".gif)";
									hButton.innerHTML = "pause";
									break
						}
						fn_update_playscroller()
						break
					case player_stop:
						$("button_player_start").className = "clsButton_ControlBar";
						$("button_player_stop").className = "clsButton_ControlBarSelected";
						var hButton = $("btn_" + WebLib.GetIdString(player_start));
						hButton.style.backgroundImage = "url(/resources/skins/touch/images/btn_" + WebLib.GetIdString(player_start) + ".gif)";
						FlashPlayer.Stop();
						break
					case menu_restart:
						window.location.reload()
						break		
					default : fn_system_message("TellaVision.fn_set_menu - unhandled ID.iProcID: " + WebLib.GetIdString(ID.iProcID));
				}
//				$("button_" + WebLib.GetIdString(MenuMode)).className = "clsButton_ControlBarSelected";
			}
		}
		
		
		/**********************************************************************************************************************************************************
		/*** PAGESCROLLER  ****************************************************************************************************************************************
		/**********************************************************************************************************************************************************/
		this.bAutoRoll = false;
		this.bAutoRollActive = false;
		this.hAutoRoll = 0;
		this.bFinger = false; 					// true if user touches screen
		this.bScreenClick = false;				// user to determine if the user issued a click
		this.intScreenWindowHeight = 438;		// used to determine maximum scroll distance
		this.intFingerStartPosition = 0;		// set on mousedown, determines finger y startposition
		this.intFingerEndPosition = 0;			// set on mouseup, determines finger y  endposition
		this.intFingerLastPosition = 0;
		this.intFingerDelta = 0;				// set on mouseup, determines finger y  endposition
		this.intFingerDeltaABS = 0;				// mode(intFingerDelta)
		this.intTargetScrollRowHeight = 0;	// height of 1 row, used to avoid end scroll position halfway row 
		this.intTargetScrollHeight = 0;			// height entire resultdiv, set by fn_write_content
		this.intTargetScrollStep = 0;			// amount of pixels to scroll, used by fn_container_move
		this.intTargetStartPosition = 0;		// set on mousedown, determines scroll start position
		this.intTargetEndPosition = 0;			// set on mouseup, determines scroll end position

		this.fn_container_mouse_down = function()
		{
			with(this)
			{
				// user has finger onscreen
				bFinger = true;			
				// tell system we're busy				
				bUIready = false;
				// store finger start position
				intFingerStartPosition = parseInt(event.y);
				// reset end position
				intFingerEndPosition = 0;						
				// store container start position						
				intTargetStartPosition = parseInt(objTarget_Content.offsetTop);			
				// set scroll step to 1 row
				intTargetScrollStep = intTargetScrollRowHeight; 	
				// if autoroll is active avoid generating a ScreenClick and stop the AutoRoller
				if(bAutoRollActive)
				{
					// turn autoroll off
					bAutoRoll = false;
					// reset click flag
					bScreenClick = false;				
					bAutoRollActive = false;
				}
				else
				{
					// AutoRoll is inactive, set the Screenclick logic
					bScreenClick = true;					
					// set timer to reset clickflag
					setTimeout("TellaVision.bScreenClick=false;",200);
				}
				fn_system_message('fn_container_mouse_down');
			}
		}

		this.fn_container_mouse_up = function()
		{
			with(this)
			{
				// user lifted finger from screen
				fn_system_message('fn_container_mouse_up');
				bFinger = false;	
				// see if the user performed a click. A click happens when AutoRoll is inActive
				if(bScreenClick && !bAutoRollActive)
				{
					//fn_system_message('click');
					fn_process_mouseaction(objTarget_Content_ClickedItem);
				}
				// if the user lifts finger before hAutoRoll expired bAutoroll is true so start the autoroll logic
				if(bAutoRoll) 
				{
					// store finger end position 						
					intFingerEndPosition = parseInt(event.y);								
					// calculate finger delta
					intFingerDelta = intFingerEndPosition - intFingerStartPosition;			
					//intTargetScrollStep = Math.round(intTargetScrollRowHeight / 4)
					intTargetEndPosition = Math.floor(objTarget_Content.offsetTop / intTargetScrollRowHeight) * intTargetScrollRowHeight;
					intTargetEndPosition = intTargetEndPosition + (Math.round(intFingerDelta / 10) * intTargetScrollRowHeight)
					if(intTargetEndPosition <  (-intTargetScrollHeight + intScreenWindowHeight)) intTargetEndPosition = (-intTargetScrollHeight + intScreenWindowHeight);
					if(intTargetEndPosition > 0) intTargetEndPosition = 0;
					fn_container_move(true)
				}
			}
		}
	
		this.fn_container_mouse_move = function()
		{
			with(this)
			{
				// if the finger is still on the touchscreen perform the container move
				if(bFinger)
				{
					// we're moving so set the autoroll active flag
					bAutoRollActive = true;
					// store finger end position
					intFingerEndPosition = parseInt(event.y);
					// calculate absolute finger delta to eliminate move noise
					intFingerDeltaABS = Math.abs(intFingerEndPosition - intFingerLastPosition);
					// refresh intFingerLastPosition
					intFingerLastPosition = intFingerEndPosition;
					// calculate finger delta
					intFingerDelta = intFingerEndPosition - intFingerStartPosition;
					//	calculate the target position using the start and delta values
					intTargetEndPosition = intTargetStartPosition + intFingerDelta;
					// start the autoscroll timer, if it elapses before the user lifts his finger disable autoscroll
					// to avoid move noise only start the times if movedelta reaches the threshold 
					if(intFingerDeltaABS > 10) 
					{
						// avoid launching the click handler
						bScreenClick = false;				
						// set Autoroll flag 
						bAutoRoll = true;
						// if there is already a times active kill it.
						if(hAutoRoll != 0) window.clearTimeout(hAutoRoll);
						// create timer
						hAutoRoll = setTimeout("TellaVision.hAutoRoll=0;TellaVision.bAutoRoll=false;",100);
					}
					else
					bAutoRoll = false;
					// if we're at the top stop scrolling
					if(intTargetEndPosition > 0) intTargetEndPosition = 0;
					// if we're at the bottom of the list stop scrolling
					if(intTargetEndPosition <  (-intTargetScrollHeight + intScreenWindowHeight)) intTargetEndPosition = (-intTargetScrollHeight + intScreenWindowHeight);
					// call the container move function and tell it not to autoscroll
					if(intFingerDeltaABS > 2) fn_container_move(false);
				}
			}
		}


		this.fn_container_move = function(bAutoScroll)
		{
			with(this)
			{
				bUIready = false;
				bAutoRollActive = true;
				var intCurrentContainerPos = parseInt(objTarget_Content.offsetTop);
				intTargetScrollStep = 1 + Math.round(Math.abs(intTargetEndPosition + Math.abs(intCurrentContainerPos)) / 50)
				if(bAutoScroll)
				{
					if(intFingerDelta < 0)
					{
						// scroll up, first detect border proximity, if near reduce FingerDelta to avoid overshoot
						objTarget_Content.style.top = (intCurrentContainerPos - intTargetScrollStep);
						if(!bFinger && (intTargetEndPosition <= objTarget_Content.offsetTop))
						{
							setTimeout("TellaVision.fn_container_move(true)",10);
						}
						else
						{
							bAutoRollActive = false;
							bUIready = true
						}
					}
					else
					{
						// scroll down, first detect border proximity, if near reduce FingerDelta to avoid overshoot
						objTarget_Content.style.top = (intCurrentContainerPos + intTargetScrollStep);
						if(!bFinger && (objTarget_Content.offsetTop <= intTargetEndPosition))
						{
							setTimeout("TellaVision.fn_container_move(true)",10);
						}
						else
						{
							bAutoRollActive = false;
							bUIready = true
						}
					}
				}
				else
				{
					objTarget_Content.style.top = intTargetEndPosition;
					bUIready = true;
					bAutoRollActive = false;
				}
			}
		}

		this.SongInfo = function(objData)
		{
			with(objData)
			{
				return strArtist  + " - " + strTitle + " (" + strAlbum + ")";						
			}
		}

		this.fn_process_mouseaction = function(ID)
		{
			var intSelStatus = 0;
			with(this)
			{
				fn_set_selected_item(ID)
				switch(ID.iType)
				{
					case db_browse_artist_songs:
						DataCommand.fn_browse_artist_songs(ID.intID)
						fn_write_content(objTarget_Content,DataCommand.colQuery)
						break						
					case type_year:
						DataCommand.fn_browse_song_year(ID.intID);
						fn_write_content(objTarget_Content,DataCommand.colQuery);		
						break
					case type_artist : 
						DataCommand.fn_browse_artist_albums(ID.intID);
						if(DataCommand.colQuery.length == 0) DataCommand.fn_browse_artist_songs(ID.intID)
						fn_write_content(objTarget_Content,DataCommand.colQuery);		
						if(MenuMode != menu_search)
						{
						MenuMode = db_browse_artist_albums
						//fn_set_contextmenu(MenuMode);
						}
						break
					case type_album : 

						DataCommand.fn_browse_album_songs(ID.intID);
						fn_write_content(objTarget_Content,DataCommand.colQuery);		
						if(MenuMode != menu_search)
						{
						MenuMode = db_browse_album_songs
						//fn_set_contextmenu(MenuMode);
						}
						break								
					case type_song : 
						// user clicked a song, see if we are in playlist mode
						if(MenuMode == menu_playlist)
						{
							// we are in playlist mode, if opmode_playlistmode is true select the song, otherwise switch objTarget_Content_CurrentItem to ID and start playling the song
							if(WebLib.GetBit(OpMode,opmode_playlistmode)) 
								fn_set_selected_item(ID)
							else
							{
								fn_set_current_item(ID)
								// load song and start playback
								//FlashPlayer.Load(ID.intID);
								//FlashPlayer.mpPlay();
								// set button cosmetics and appropriate contextmenu
								$("button_player_start").className = "clsButton_ControlBarSelected";
								//MenuMode = type_song
								//fn_set_contextmenu(MenuMode);
							}
						}
						else
						{
							if(WebLib.GetBit(OpMode,opmode_playlistmode)) 
								fn_set_selected_item(ID)
							else
							{
								// user clicked a song while in direct_playmode, set the colQuery bit to status_current for the selected song
								idx = parseInt(ID.idx)
								DataCommand.colQuery[idx].intStatus = WebLib.SetBit(DataCommand.colQuery[idx].intStatus,status_current);
								// copy colQuery to playlist collection
								DataCommand.colPlaylist = DataCommand.colQuery.clone();
								// reload the playlist
								MenuMode = menu_playlist
								fn_set_menu($("button_menu_playlist"));
								// perform a fn_set_current_item to fill datacommand.reccurrent and scroll the current item into the top position
								fn_set_current_item(objTarget_Content_CurrentItem)
								// load song and start playback
								// set button cosmetics and appropriate contextmenu
								$("button_player_start").className = "clsButton_ControlBarSelected";
								//fn_set_contextmenu(MenuMode);
							}
						}
						break
					case type_genre: 
						DataCommand.fn_browse_genre_songs(ID.intID);
						fn_write_content(objTarget_Content,DataCommand.colQuery);		
						MenuMode = db_browse_genre_songs
						//fn_set_contextmenu(MenuMode);
						break								
					case type_playlist: 
						DataCommand.recCurrent.Data.intPlaylistID = ID.intID;
						DataCommand.fn_playlist_list_songs(ID.intID);
						DataCommand.colPlaylist = DataCommand.colQuery.clone();
						DataCommand.colPlaylist[1].intStatus = WebLib.SetBit(DataCommand.colPlaylist[1].intStatus,status_current);
						fn_set_menu($("button_menu_playlist"))
						//fn_set_current_item(objTarget_Content_CurrentItem)
						FlashPlayer.Load(objTarget_Content_CurrentItem.intID);
						FlashPlayer.mpPlay();
						break
				}
			}
		}
		


		this.fn_destroy_menu = function (objTree)
		{
			with(this)
			{
				var iQCn = 0;
				var bIE = WebLib.isIE();
				if(bIE){
					var colTags = objTree.all.tags("DIV")
				}else{
					var colTags = objTree.getElementsByTagName("DIV");
				}
				var objNode = null;
				// countdown to make sure children go before parents!
				for(iQCn = colTags.length;iQCn=0;iQCn--)
				{
					objNode = colTags[iQCn]
					WebLib.RemoveEvent(objNode, "mousedown",function (event){aElement.unleak_onmousedown(event)},false)
					objTree.removeChild(objNode)
					objNode = null;
				}
				objTree.innerHTML='';
			}
		}

	
		this.fn_clean_content = function (objTarget)
		{
			with(this)
			{
				var iQCn = 0;
				if(WebLib.isIE()){
					var colTags = objTarget.all.tags("DIV")
				}else{
					var colTags = objTarget.getElementsByTagName("DIV");
				}
				var objNode = null;
				for(iQCn=0;iQCn < colTags.length;iQCn++)
				{
					objNode = colTags[iQCn]
					if(objNode.id != '')
					{
						WebLib.RemoveEvent(objNode, "mousedown",function(){listElement.unleak_onmousedown()},false);
						objNode.unleak_onmousedown = null;
						objTarget.removeChild(objNode)
						objNode = null;
					}
				}
				objTarget.innerHTML='';
			}
		}
		
		
		this.CreateContainer = function(strText,strCls)
		{
			with(this)
			{
				var objElement = document.createElement("DIV");	
				objElement.className = strCls;
				objElement.innerHTML = strText;
				return objElement;
			}	
		}		

		this.CreateImageContainer = function(strSource,strCls)
		{
			with(this)
			{
				var objElement = document.createElement("IMG");	
				objElement.className = strCls;
				objElement.src = strSource;
				return objElement;
			}	
		}		
		
		this.fn_write_content = function(objTarget,colData)
		{
			with (this)
			{
				var objEntry = Object;
				var intID = 0;
				
				objTarget.style.top = 0;
				fn_clean_content(objTarget);
				for(intIndex=1; intIndex <= colData.length; intIndex++) 
				{
					objTarget.appendChild(fn_create_content(colData,intIndex));
				}
				intTargetScrollHeight = parseInt(objTarget.offsetHeight);
			}
		}

		this.fn_create_content = function(objData,iIndex)
		{
			with(this)
			{
				var listElement = document.createElement("DIV");	
				var strContent = "";
				listElement.id = "ID_" + iIndex;
				listElement.idx = iIndex;
				listElement.intID = objData[iIndex].intID;
				listElement.iType = objData[iIndex].intTypeID;
				listElement.iStat = objData[iIndex].intStatus;
				if(WebLib.GetBit(objData[iIndex].intStatus,status_current)) 
					objTarget_Content_CurrentItem = listElement;
				if(WebLib.GetBit(objData[iIndex].intStatus,status_selected)) 
					objTarget_Content_SelectedItem = listElement;
				setItemClass(listElement);
				listElement.unleak_onmousedown = function(){objTarget_Content_ClickedItem = listElement};
				switch(objData[iIndex].intTypeID) //intColType
				{
					case type_song: 
						listElement.appendChild(CreateContainer(objData[iIndex].strSong,"cls_entry_title"));
						listElement.appendChild(CreateContainer(objData[iIndex].strGenre,"cls_entry_genre"));
						listElement.appendChild(CreateContainer(objData[iIndex].strArtist,"cls_entry_artist"));
						listElement.appendChild(CreateContainer(objData[iIndex].strAlbum,"cls_entry_album"));
						listElement.appendChild(CreateContainer("Jaar:&nbsp;" + objData[iIndex].strYear,"cls_entry_year"));
						listElement.appendChild(CreateContainer("Duur:&nbsp;" + objData[iIndex].intSongID,"cls_entry_duration"));
//						listElement.appendChild(CreateContainer("Duur:&nbsp;" + WebLib.ConvertTime(objData[iIndex].strDuration),"cls_entry_duration"));
						listElement.appendChild(CreateContainer("Kwaliteit:&nbsp;" + objData[iIndex].strBitRate,"cls_entry_bitrate"));
						break
					case type_user:
						//if(MenuMode != menu_search) listElement.style.backgroundImage = "url(/streamer/image.asp?f=user_" + objData[iIndex].intID + "&q=99)";
						if(WebLib.GetBit(objData[iIndex].intAccessLevel,priv_guest)) 	strContent = "gast"
						if(WebLib.GetBit(objData[iIndex].intAccessLevel,priv_user)) 	strContent = "gebruiker"
						if(WebLib.GetBit(objData[iIndex].intAccessLevel,priv_friend)) 	strContent = "vriend"
						if(WebLib.GetBit(objData[iIndex].intAccessLevel,priv_partner)) 	strContent = "lover"
						if(WebLib.GetBit(objData[iIndex].intAccessLevel,priv_owner)) 	strContent = "owner"
						if(WebLib.GetBit(objData[iIndex].intAccessLevel,priv_admin)) 	strContent = "admin";
						listElement.appendChild(CreateContainer(objData[iIndex].strFirstName + " " + objData[iIndex].strLastName,"cls_entry_title"));
						listElement.appendChild(CreateContainer(strContent,"cls_entry_details"));
						break
					case type_playlist:
						//if(MenuMode != menu_search) listElement.style.backgroundImage = "url(/streamer/image.asp?f=playlist_" + objData[iIndex].intID + "&q=50&w=200&h=200)";
						listElement.appendChild(CreateContainer(objData[iIndex].strTitle,"cls_entry_title"));
						listElement.appendChild(CreateContainer(objData[iIndex].strDescription,"cls_entry_details"));
						break
					case type_genre:
						//if(MenuMode != menu_search) listElement.style.backgroundImage = "url(/streamer/image.asp?f=genre_" + objData[iIndex].intID + "&q=99)";
						listElement.appendChild(CreateContainer(objData[iIndex].strTitle,"cls_entry_title"));
						listElement.appendChild(CreateContainer(objData[iIndex].strDescription,"cls_entry_details"));
						break
					case type_year:
						//if(MenuMode != menu_search) listElement.style.backgroundImage = "url(/streamer/image.asp?f=" + objData[iIndex].intID + "&q=99)";
						listElement.appendChild(CreateContainer(objData[iIndex].strYear,"cls_entry_title"));
						break
					case type_artist:
						if(MenuMode != menu_search)
						{
							strContent = WebLib.DeSpace(objData[iIndex].strArtist)
							//listElement.style.backgroundImage = "url(/streamer/image.asp?f=" + strContent + "&q=50&w=200&h=200)";
						}
						listElement.appendChild(CreateContainer(objData[iIndex].strArtist,"cls_entry_title"));
						listElement.appendChild(CreateContainer(objData[iIndex].strDescription,"cls_entry_details"));
						break
					case type_album:
						if(MenuMode != menu_search) 
						{
							strContent = WebLib.DeSpace(objData[iIndex].strArtist + "-" + objData[iIndex].strTitle);
							//listElement.style.backgroundImage = "url(/streamer/image.asp?f=" + strContent + "&q=50&w=200&h=200)";
						}
						listElement.appendChild(CreateContainer(objData[iIndex].strTitle,"cls_entry_title"));
						listElement.appendChild(CreateContainer(objData[iIndex].strArtist + " (" + objData[iIndex].intID + ")","cls_entry_details"));
						break
					case db_browse_artist_songs:
						//if(MenuMode != menu_search) listElement.style.backgroundImage = "url(/streamer/image.asp?f=allsongs&q=50&w=200&h=200)";
						listElement.appendChild(CreateContainer(objData[iIndex].strTitle,"cls_entry_title"));
						listElement.appendChild(CreateContainer(objData[iIndex].intID + " - "+ objData[iIndex].strDescription,"cls_entry_details"));
						break
					default:
						alert("Unknown Entrytype in TellaVision.fn_add_contentitem");
						strContent = objData[iIndex].strArtist.replace(" ","") + "-" + objData[iIndex].strTitle.replace(" ","");
						listElement.appendChild(CreateContainer("Unknown Entrytype in TellaVision.fn_add_contentitem","cls_entry_title"));
						listElement.appendChild(CreateContainer(objData[iIndex].strDescription,"cls_entry_details"));
						break
				}
				WebLib.AddEvent(listElement,"mousedown",function(){listElement.unleak_onmousedown()},false);//listElement.unleak_onmousedown
				return listElement;
			}
		}
		
		this.setItemClass = function(ID)
		{
			with(this)
			{
				if(MenuMode == menu_search)
				{
					ID.className = strSearchEntryClass
				}
				else
				{			
					sContentClass = "cls_"+ WebLib.GetIdString(ID.iType);
					ID.className = sContentClass
					if(WebLib.GetBit(ID.iStat,status_selected))		ID.className = sContentClass + "_selected";  
					if(WebLib.GetBit(ID.iStat,status_master)) 		ID.className = sContentClass + "_master";
					if(WebLib.GetBit(ID.iStat,status_current)) 		ID.className = sContentClass + "_current";
					if(WebLib.GetBit(ID.iStat,status_tagged)) 		ID.className = sContentClass + "_tagged"; 
				}
			}
		}
		
		function ConvertTime(inVal)
		{
			var intMinutes = Math.round(inVal/60);
			if((intMinutes * 60) > inVal) intMinutes--;
			var intSeconds = Math.round(inVal - (intMinutes * 60));
			return intMinutes + ":" + intSeconds
		}

		
		


		
		

		/**********************************************************************************************************************************************************
		/*** VOLUME CONTROL  **************************************************************************************************************************************
		/**********************************************************************************************************************************************************/
		this.SetVolumeLevel = function(idVolume,idVolScroller)
		{
			with(this)
			{
				iVolPosition = event.y;
				var iStartPos = 161;
				var iEndPos = 551;
				if(iVolPosition < iStartPos) iVolPosition = iStartPos
				if(iVolPosition > iEndPos) iVolPosition = iEndPos
				idVolScroller.style.top = iVolPosition - 30;
				iVolPosition = iVolPosition - iStartPos
				intCurrentVolumeLevel = 100 * ((iEndPos - iStartPos - iVolPosition)/ (iEndPos - iStartPos))
				// mimic log volume scale
				if((0 < intCurrentVolumeLevel) && (intCurrentVolumeLevel < 20)) intCurrentVolumeLevel = intCurrentVolumeLevel / 3;
				if((21 < intCurrentVolumeLevel) && (intCurrentVolumeLevel < 40)) intCurrentVolumeLevel = intCurrentVolumeLevel / 2;
				intCurrentVolumeLevel = Math.round(intCurrentVolumeLevel);
				//FlashPlayer.mpSetVolume(intCurrentVolumeLevel)
				idVolScroller.innerHTML = "Volume<br>" + intCurrentVolumeLevel + "%"
			}
		}
		
		this.fn_create_volumecontrol = function(idVolume,idVolScroller)
		{
			with(this)
			{
				idVolScroller.innerHTML = "Volume<br>0%"
				WebLib.AddEvent(idVolume,"mousemove",function (event){TellaVision.SetVolumeLevel(idVolume,idVolScroller)},false);//listElement.unleak_onmousedown				
				WebLib.AddEvent(idVolume,"mousedown",function (event){TellaVision.bUIready=false;},false);//listElement.unleak_onmousedown				
				WebLib.AddEvent(idVolume,"mouseup",function (event){TellaVision.bUIready=true;},false);//listElement.unleak_onmousedown				
			}
		}
		/**********************************************************************************************************************************************************
		/*** PLAYER SCROLL CONTROL ************************************************************************************************************************
		/**********************************************************************************************************************************************************/
		this.fn_create_playscroller = function(idDiv)
		{
			with(this)
			{
				for(x=1; x<=111;x++)
				{
					var iElement = document.createElement("DIV");
					iElement.className = "clsPlayerTimerScale";
					idDiv.appendChild(iElement);
				}		
				WebLib.AddEvent(idDiv,"mousemove",function (event){TellaVision.fn_playscroller_onclick(this)},false);//listElement.unleak_onmousedown				
			}
		}
		
		this.fn_playscroller_onclick = function(id)
		{
			with(this)
			{
				fn_clear_playscroller();
//				FlashPlayer.mpSeek(Math.round((e.x / 800) * FlashPlayer.intDuration));
//				FlashPlayer.mpSeek(Math.round((event.x / 800) * FlashPlayer.intDuration));
			}
		}
		
		this.fn_update_playscroller_loadmedia = function(intIndex)
		{
			with(this)
			{
				var BarIndex = Math.round(idPlayerTimer.childNodes.length * intIndex / 100)
				if(intIndex <= idPlayerTimer.childNodes.length)
				{
					for(x=1;x<=BarIndex;x++) idPlayerTimer.childNodes(x).className = "clsPlayerTimerScaleLoaded";
				}
			}
		}	

		this.fn_clear_playscroller = function()
		{
			with(this)
			{
				for(x=1; x < objPlayerTimer.childElements.length; x++)
				{
					objPlayerTimer.childElements(x).className = "clsPlayerTimerScale"; //.childElements(); childNodes
				}
			}
		}	

		this.fn_update_playscroller = function(intIndex)
		{
			with(this)
			{
				if((intIndex >= 0) && (intIndex <= idPlayerTimer.childNodes.length))
				{
					var BarIndex = Math.round(idPlayerTimer.childNodes.length * intIndex / 100)
					for(x=0;x<=BarIndex;x++) idPlayerTimer.childNodes(x).className = "clsPlayerTimerScaleSelected";
				}
			}
		}	

		/**********************************************************************************************************************************************************
		/*** KEYBOARD CONTROL ************************************************************************************************************************
		/**********************************************************************************************************************************************************/
		this.fn_clear_keyboard = function()
		{
			with (this)
			{
				strKeyString = "";
			}
		}
		this.fn_process_keyboard = function(idKey,intKeyStatus)
		{
			with (this)
			{
				switch(idKey.type)
				{
					case "key":
						switch(intKeyStatus)
						{
							case key_up: idKey.className = "clsKey";break
							case key_down: 
								idKey.className = "clsKeyDown";
								strKeyString += idKey.innerHTML; //.toUpperCase();
								break
						}
						fn_process_searchquery(strKeyString);
						break
					case "search_clear":
						switch(intKeyStatus)
						{
							case key_up: idKey.className = "clsKeySmallCap";break
							case key_down: idKey.className = "clsKeySmallCapDown";break
						}
						strKeyString = "";
						fn_search_term("De zoekopdracht is gewist");
						if(hfn_process_searchquery != 0) window.clearTimeout(hfn_process_searchquery)
						break
					case "space": 
						switch(intKeyStatus)
						{
							case key_up: idKey.className = "clsSpace";break
							case key_down: 
								idKey.className = "clsSpacedown";
								strKeyString += " "; 
								break
						}
						fn_process_searchquery(strKeyString);
						break
					case "backspace": 
						switch(intKeyStatus)
						{
							case key_up: idKey.className = "clsKey";break
							case key_down: 
								idKey.className = "clsKeydown";
								strKeyString = strKeyString.substr(0,strKeyString.length-1); 
								break
						}
						fn_process_searchquery(strKeyString);
						break
					case "search_mode":
						switch(intKeyStatus)
						{
							case key_up: idKey.className = "clsKeySmallCap";break
							case key_down: 
								idKey.className = "clsKeySmallCapDown";
								switch(DataCommand.intSearchMode)
								{
									case search_targeting_begin:
										DataCommand.intSearchMode = search_targeting_loose;
										idKey.innerHTML = 'bevat';
										break
									case search_targeting_loose:
										DataCommand.intSearchMode = search_targeting_exact;
										idKey.innerHTML = 'exact';
										break							
									case search_targeting_exact:
										DataCommand.intSearchMode = search_targeting_begin;
										idKey.innerHTML = 'begin';
										break
								}
								fn_process_searchquery(strKeyString);
								break
						}
						break
				}
			}
		}
	
		this.fn_process_searchquery = function(strQuery)
		{
			var sWindow = "";
			var strTargetMode = "";
			var strDialog = ""
			with(this)
			{
				// this function delays execution of the freeform query to avoid slow responses due to high result counts on short searchstrings
				if(hfn_process_searchquery != 0) window.clearTimeout(hfn_process_searchquery)
				switch(DataCommand.intSearchMode)
				{
					case search_targeting_begin: strTargetMode = " <span class=\"clsSearchTerm\">" + strQuery + "</span> [begint met]" + strDialog; break
					case search_targeting_exact: strTargetMode = " <span class=\"clsSearchTerm\">" + strQuery + "</span> [exact]" + strDialog; break
					case search_targeting_loose: strTargetMode = " <span class=\"clsSearchTerm\">" + strQuery + "</span> [bevat]" + strDialog; break
				}
				sWindow = "zoek ";
				switch(DataCommand.intSearchFieldType)
				{
					case type_artist: fn_search_term(sWindow + "artiest" + strTargetMode); break
					case type_album: fn_search_term(sWindow + "album" + strTargetMode); break
					case type_song: fn_search_term(sWindow + "liedje" + strTargetMode); break
					case type_year: fn_search_term(sWindow + "jaartal: <span class=\"clsSearchTerm\">" + strQuery + "</span>"); break
				}
				DataCommand.strMediaSearch = strQuery;
				if(strQuery.length >= 2) hfn_process_searchquery = setTimeout("TellaVision.fn_execute_searchquery()",2000);
			}
		}
		
		this.fn_execute_searchquery = function()
		{
			with(this)
			{	

				fn_system_message("Bezig....")
				DataCommand.fn_search_execute();
				fn_write_content(objTarget_Content,DataCommand.colQuery);		
				fn_system_message("Zoekresultaten.");
				fn_system_message("")
			}
		}
	}

