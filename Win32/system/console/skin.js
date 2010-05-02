	function clsTellaVision(){
		this.button = new Array();
		this.headerbtn = new Array();
		this.footerbtn = new Array();
		this.objBody = Object;
		this.objMenuHome = Object;
		this.objMenuSearch = Object;
		this.objMenuCoverflow = Object;
		this.uicmd = uicmd_home;
		this.fn_busy = function(bBusy){
			with(this){
				uistate = (bBusy) ? WL.SetBit(uistate,uistate_splash) : WL.ResetBit(uistate,uistate_splash)
				fn_uistate_update()
			}
		}		
		this.fn_callback = function(){}
		this.fn_element_add = function(idelement,iaction,sclass,stext){
			with(this){
				var objElement = document.createElement('div');	
				objElement.id = "dv" + idelement;
				objElement.set = 	function(iaction,sclass,stext){
										if(iaction == null){
											objElement.setAttribute("IDA", uicmd_void)
											objElement.style.display = "none";
										}else{
											objElement.style.display = "";
											objElement.setAttribute("IDA", iaction)
											if(sclass != null) objElement.className = sclass;
											if(stext != null) objElement.innerHTML = stext;
										}
									}			
				objElement.set(iaction,sclass,stext)
				return objElement
			}
		}	

		this.intVolume_CurrentLevel = 0;
		this.volume_startpos = 0;
		this.volume_endpos = 0;
		this.hServerTimer = 0;	

		this.fn_transitions = function(){}
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
						case type_playlist_song:
							Control.ClientTypeID = iDbAction;
							fn_browse_page(0);
							break
						case db_browse_genre:
							bWalkResults = false;
							fn_loadgenrepresets();
							for(intIndex = 1; intIndex < colQuery.length;  intIndex++) objMenuSearch.keyboard_Filter_Genre.appendChild(fn_add_option(colQuery[intIndex].intID,colQuery[intIndex].strGenre));
							break
						case db_browse_year:
							bWalkResults = false;
							fn_loadyearpresets();
							for(intIndex = 1; intIndex < colQuery.length;  intIndex++) objMenuSearch.keyboard_Filter_Year.appendChild(fn_add_option(colQuery[intIndex].intYear,colQuery[intIndex].intYear));
							break
						case db_browse_artist_songs:		fn_dbexec(PageInfo[type_artist].Selected.intID,iDbAction);break
						case db_browse_artist_albums:		fn_dbexec(PageInfo[type_artist].Selected.intID,iDbAction);break
						case db_browse_artist_albums_va:	fn_dbexec(PageInfo[type_artist].Selected.intID,iDbAction);break
						case db_browse_album_songs:			fn_dbexec(PageInfo[type_album].Selected.intID,iDbAction);break
						case db_browse_history:				fn_loadhistorypresets();break
						case db_browse_history_selection:
							fn_gethistory(sSearchString);
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
						case db_browse_page:
							iTimes = 1;
							hfn_selectpage = WL.fn_cleartimer(hfn_selectpage);
							fn_browse_page(sSearchString);
							break
						case db_search:
							strMediaSearch = (sSearchString.length == 0) ? "%%" : sSearchString
							fn_search_execute();
							break;
						case db_playlist_list_artist_add:
						case db_playlist_list_album_add:
						case db_playlist_list_song_delete:
						case db_playlist_list_song_add:
							// check for current playlist
							if(PageInfo[type_playlist].Current.intID !=0){
								Control.strSelSet = "";
								for(intIndex = 0; intIndex < objMenuSearch.resultsContainer.current.childNodes.length; intIndex++){
									objMenuSearch.resultsContainer.current.childNodes[intIndex].getProperties();
		//							avoid processing placeholders
									if(Control.ClientTypeID == type_void) break;
									if(WL.GetBit(PageInfo[Control.ClientTypeID].Selected.intStatus,status_selected)){
		//								reset status_selected bit
										PageInfo[Control.ClientTypeID].Selected.intStatus = WL.ResetBit(PageInfo[Control.ClientTypeID].Selected.intStatus,status_selected);
		//								update topic
										objMenuSearch.resultsContainer.current.childNodes[intIndex].setProperties(PageInfo[Control.ClientTypeID].Selected);
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
									DataCommand.Control.ClientTypeID = type_playlist_song;
									fn_dbexec(PageInfo[type_playlist].Current.intID,iDbAction);
								}
							}else{
								alert('je hebt nog geen playlist geselecteerd !');
							}
//							uistate = WL.ResetBit(uistate,uistate_select);
							break
						case list_moveup:
						case list_movedown:
							switch(iDbAction){
								case list_moveup:
										for(intIndex = 0; intIndex < objMenuSearch.resultsContainer.current.childNodes.length; intIndex++){
											objMenuSearch.resultsContainer.current.childNodes[intIndex].getProperties();
				//							avoid processing placeholders
											if(Control.ClientTypeID == type_void) break;
											if(WL.GetBit(PageInfo[Control.ClientTypeID].Selected.intStatus,status_selected)) objMenuSearch.resultsContainer.current.childNodes[intIndex].moveUp();
										}
										break
								case list_movedown:
										for(intIndex = objMenuSearch.resultsContainer.current.childNodes.length-1; intIndex >= 0; intIndex--){
											objMenuSearch.resultsContainer.current.childNodes[intIndex].getProperties();
				//							avoid processing placeholders
											if((Control.ClientTypeID != type_void) && WL.GetBit(PageInfo[Control.ClientTypeID].Selected.intStatus,status_selected)) objMenuSearch.resultsContainer.current.childNodes[intIndex].moveDown()
										}
										break
							}
							Control.strSelSet = "";
							for(intIndex = 0; intIndex < objMenuSearch.resultsContainer.current.childNodes.length; intIndex++){
								objMenuSearch.resultsContainer.current.childNodes[intIndex].getProperties();
	//							avoid processing placeholders
								if(Control.ClientTypeID == type_void) break;
//								build xml select string
								Control.strSelSet += "<item>" + PageInfo[Control.ClientTypeID].Selected.intID + "</item>";
							}
							// normally set by IDA, force playlist_song type
							DataCommand.Control.ClientTypeID = type_playlist_song;
							fn_dbexec(PageInfo[type_playlist].Current.intID,db_playlist_save_sortorder);
//							uistate = WL.ResetBit(uistate,uistate_select);
							break
						default:
							fn_page_status("fn_displayresults: unhandled (" + iDbAction + ")");
							bWalkResults = false;
					}
					// move resultpane back to top position
					fn_transitions(false)
					if(bWalkResults){
						objMenuSearch.resultsContainer.style.top = "0px"
						PageInfo[Control.ServerTypeID].PanePosition = 0;
						var objTarget = fn_resultselector(Control.ServerTypeID);
						if(colQuery.length == 0){
	//						clean up
							for(intIndex = 0; intIndex < objTarget.childNodes.length; intIndex++) objTarget.replaceChild(fn_create_content(recVoid),objTarget.childNodes[intIndex]);
						}else{
							for(intIndex = 0; intIndex < objTarget.childNodes.length; intIndex++) objTarget.replaceChild(fn_create_content((intIndex < colQuery.length) ? colQuery[intIndex+1] : recVoid),objTarget.childNodes[intIndex]);
							// only display the pager if pagecount > 1
						if(PageInfo[Control.ServerTypeID].ServerPageCount > 1) fn_setfootermenu(true)
						}
						fn_page_status(fn_currentmedia())
					}
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
		this.fn_setvolume = function(iVolPosition){
			with(this)
			{
				if((iVolPosition > volume_startpos) && (iVolPosition < volume_endpos))
				{
					volscroller.style.top = iVolPosition - 30;
					iVolPosition = iVolPosition - volume_startpos
					intVolume_CurrentLevel = 100 * ((volume_endpos - volume_startpos - iVolPosition)/ (volume_endpos - volume_startpos))
					// mimic log volume scale
					if((0 < intVolume_CurrentLevel) && (intVolume_CurrentLevel < 20)) intVolume_CurrentLevel = intVolume_CurrentLevel / 3;
					if((21 < intVolume_CurrentLevel) && (intVolume_CurrentLevel < 40)) intVolume_CurrentLevel = intVolume_CurrentLevel / 2;
					intVolume_CurrentLevel = Math.round(intVolume_CurrentLevel);
					volscroller.innerHTML = "Volume<br>" + intVolume_CurrentLevel + "%"
					// avoid swamping the server with volume change requests
					hServerTimer = WL.fn_cleartimer(hServerTimer) 
					hServerTimer = setTimeout("DataCommand.fn_server_setvolume(" + intVolume_CurrentLevel + ");",20);
					//fn_debug()
				}
			}
		}
		this.fn_touchhandler = function(evt,iClickMode){
			var IDme = evt.srcElement;
			var ID = IDme.parentElement;
			var IDA = (IDme.getAttribute("IDA") == null) ? ID.getAttribute("IDA") : IDme.getAttribute("IDA")
			var strSearchCaption = "";
			with(this){			// submenu height: 440
				switch(iClickMode){
					case mouse_move:
						switch(IDA){
							case uicmd_setvolume:	fn_setvolume(evt.y);break
						}
						break
					case mouse_over:	
						break
					case mouse_up:	
						break
					case mouse_down:	
						switch(IDA){
							case uicmd_home:		if(uicmd != uicmd_home)
														fn_uimenu(uicmd_home)
													else
														switch(uicmd){
															case uicmd_home:		uicmd = uicmd_shutdown
																					with(objMenuHome){
																						className = "clsMenuMainLogo";
																						boxheader.innerHTML = "Kappe ?";
																						boxmessage.innerHTML = "Druk op ja om te kappen of op nee om door te gaan met het beluisteren van jouw muziekjes";
																						button[0].set(sys_shutdown,"clsButton_terminate","exit");						
																						button[1].set();
																						button[2].set();
																					} break
															case uicmd_search:
															case uicmd_coverflow:	uicmd = uicmd_home;break
															case uicmd_shutdown:	uicmd = uicmd_home;
																					with(objMenuHome){
																						className = "clsMenuMainNormal";
																						boxheader.innerHTML = "Welkom bij Terratunes";
																						boxmessage.innerHTML = "Terratunes koppelt jouw muziek aan die van je familie op een simpele en leuke manier. Terratunes is een nederlands opensource product. Raadpleeg voor meer informatie over Terratunes en de gebruikers overeenkomst de bijsluiter op deze server";
																						button[0].set(uicmd_search,"clsButton_search","zoek");
																						button[1].set(uicmd_coverflow,"clsButton_coverflow","cover flow");
																						button[2].set(uicmd_mplayer,"clsButton_mediaplayer","mediaplayer");
																					}break
														}
													break
							case uicmd_search: 		
							case uicmd_coverflow:	fn_uimenu(IDA);
													//fn_uistate_update();
													break  
							case sys_shutdown:		DataCommand.fn_dbexec(Settings.ServerMAC,sys_shutdown);break
						}break
				}
			}
		}
		this.fn_uimenu = function(imenu){
			with(this){
				switch(imenu){
					case uicmd_search: 
						objMenuHome.style.display="none";
						objMenuSearch.style.display="";
						objMenuCoverflow.style.display="none";	
						uicmd = imenu;				
						break
					case uicmd_coverflow:
						objMenuHome.style.display="none";
						objMenuSearch.style.display="none";
						objMenuCoverflow.style.display="";			
						uicmd = imenu;				
						break
					case uicmd_home:
						objMenuHome.style.display="";
						objMenuSearch.style.display="none";
						objMenuCoverflow.style.display="none";			
						uicmd = imenu;				
						with(objMenuHome){
							className = "clsMenuMainNormal";
							boxheader.innerHTML = "Welcome to Terratunes";
							boxmessage.innerHTML = "Terratunes koppelt jouw muziek aan die van je familie op een simpele en leuke manier. Terratunes is een nederlands opensource product. Raadpleeg voor meer informatie over Terratunes en de gebruikers overeenkomst de bijsluiter op deze server";
							button[0].set(uicmd_search,"clsButton_search","zoek");
							button[1].set(uicmd_coverflow,"clsButton_coverflow","cover flow");
							button[2].set(uicmd_mplayer,"clsButton_mediaplayer","mediaplayer");
						}break
				}
			}
		}
		this.fn_uistate_update = function(){
			with(this){
			/*
				var iHeaderHeight = 20;
				objMenuSearch.headermenu.style.top = iHeaderHeight + "px";
				fn_transitions(false)

//				splashlogic
				if(WL.GetBit(uistate,uistate_splash))
					with(objMenuSearch.splash.style){
						top = objMenuSearch.results.offsetTop + 8 + "px";
						height = objMenuSearch.results.offsetHeight - 20 + "px";
						display = "";
				}else{
					objMenuSearch.splash.style.display = "none";
					objHeaderSubMenu.style.display = (WL.GetBit(uistate,uistate_submenu)) ? "" : "none";
					objMenuSearch.headermenuSwipeDiv.style.display = (WL.GetBit(uistate,uistate_header)) ? "" : "none";
				//	objMediaPlayer.style.display = (!WL.GetBit(uistate,uistate_keyboard) && (WL.GetBit(uistate,uistate_mplayer) || WL.GetBit(uistate,uistate_remote))) ? "" : "none";
					objMenuSearch.keyboard.style.display = (WL.GetBit(uistate,uistate_keyboard)) ? "" : "none";
					objMenuSearch.keyboard_Filter.style.display = (WL.GetBit(uistate,uistate_filter)) ? "" : "none";
					objMenuSearch.messages.style.display = (WL.GetBit(uistate,uistate_message)) ? "" : "none";
					iHeaderHeight += objMenuSearch.headermenu.offsetHeight;
					if(WL.GetBit(uistate,uistate_results)){
						objMenuSearch.results.style.top = iHeaderHeight + "px";
						objMenuSearch.results.style.height = objMenuSearch.footermenu.offsetTop - iHeaderHeight + "px";
						objMenuSearch.results.style.display = ""
					}else{
						objMenuSearch.results.style.display = "none"
					}
					objMenuSearch.footermenu.style.display = (WL.GetBit(uistate,uistate_footer)) ? "":"none";
				}
				fn_setfootermenu();
				fn_transitions(true)
			*/	
			
			}
		}
	}
	/**********************************************************************************************************************************************************************
	/*** Initialize classes ***********************************************************************************************************************************************
	/**********************************************************************************************************************************************************************/
	var Settings = new clsSettings();				//	contains all by server populated application settings
	var WL = new clsWebLibrary();				//	generic function library
	var DataCommand = new clsDbCommand();		//	database ajax layer
	var TellaVision = new clsTellaVision();		//	main navigation & content handling
	/**********************************************************************************************************************************************************************
	/*** Startup **********************************************************************************************************************************************************
	/**********************************************************************************************************************************************************************/
	function fn_starttellavision(){
		//alert('fn_starttellavision');
		Settings.cmdXML = "";
		// called from server, not needed at this point
	}
	function fn_start(){
		//alert('fn_start');

		with(DataCommand){
			// provide a handler for datacommand.fn_talkback which is used to receive server messages
			fn_update = function(i) {TellaVision.fn_callback(i)}
			// provide dbcommand with a link to the talkback object
			objTalkBack = $("tellavision_talkback");
			fn_initialize(Settings.cmdXML)
		}
		with(TellaVision){
			objBody = $("idBody");
			objMenuHome = $("dvMenuHome");
			objMenuSearch = $("dvMenuSearch");
			objMenuCoverflow = $("dvMenuCoverflow");	
			with(objBody){
				attachEvent("onmousedown",function (event){fn_touchhandler(event,mouse_down)},false);
				attachEvent("onmouseup",function(event){fn_touchhandler(event,mouse_up)},false);
				attachEvent("onmousemove",function(event){fn_touchhandler(event,mouse_move)},false);	
				attachEvent("onselectstart",function(event){return false},false);	
				//attachEvent("oncontextmenu",function(event){return false},false);
				setAttribute("IDA", 0);				
			}
			with(objMenuHome){
				className = "clsMenuMainNormal";
				setAttribute("IDA", 0);
				homebutton = objMenuHome.appendChild(fn_element_add("HomeButton",uicmd_home));
				titlebar = objMenuHome.appendChild(fn_element_add("TitleBar",uicmd_void,"","Terratunes V" + Settings.AppVersion + " [" + Settings.ServerLanIp + ((Settings.ServerWanIp == '') ? "" : ":" + Settings.ServerWanIp) + "]"));
				boxheader = objMenuHome.appendChild(fn_element_add("BoxHeader",uicmd_void));
				boxmessage = objMenuHome.appendChild(fn_element_add("BoxMessage",uicmd_void));
				buttonbar = objMenuHome.appendChild(fn_element_add("ButtonBar",uicmd_void));
				button[0] = buttonbar.appendChild(fn_element_add("BarButton_0"));
				button[1] = buttonbar.appendChild(fn_element_add("BarButton_1"));
				button[2] = buttonbar.appendChild(fn_element_add("BarButton_2"));
				button[3] = buttonbar.appendChild(fn_element_add("BarButton_3"));
				button[4] = buttonbar.appendChild(fn_element_add("BarButton_4"));
				button[5] = buttonbar.appendChild(fn_element_add("BarButton_5"));
			}
			with(objMenuSearch){
				setAttribute("IDA", 0);
				splash = objMenuSearch.appendChild(fn_element_add("splash"));
				sidebar = objMenuSearch.appendChild(fn_element_add("SideBar",uicmd_void));
				homebutton = sidebar.appendChild(fn_element_add("Logo",uicmd_home));
				voltouchlayer = sidebar.appendChild(fn_element_add("VolTouchLayer",uicmd_setvolume));
				volscroller = sidebar.appendChild(fn_element_add("VolumeScroller",uicmd_void));
				headermenu = objMenuSearch.appendChild(fn_element_add("HeaderMenu",uicmd_void));
				headerbtn[0] = headermenu.appendChild(fn_element_add("HeaderButton_0",uicmd_void));
				headerbtn[1] = headermenu.appendChild(fn_element_add("HeaderButton_1",uicmd_void));
				headerbtn[2] = headermenu.appendChild(fn_element_add("HeaderButton_2",uicmd_void));
				headerbtn[3] = headermenu.appendChild(fn_element_add("HeaderButton_3",uicmd_void));
				messages = objMenuSearch.appendChild(fn_element_add("Message",uicmd_void));
				results = objMenuSearch.appendChild(fn_element_add("Result",uicmd_void));
				resultcontainer = results.appendChild(fn_element_add("ResultContainer",uicmd_void));
				resultcontainer.artists = resultcontainer.appendChild(fn_element_add("Artists",uicmd_void));
				resultcontainer.albums = resultcontainer.appendChild(fn_element_add("Albums",uicmd_void));
				resultcontainer.songs = resultcontainer.appendChild(fn_element_add("Songs",uicmd_void));
				resultcontainer.users = resultcontainer.appendChild(fn_element_add("Users",uicmd_void));
				resultcontainer.playlists = resultcontainer.appendChild(fn_element_add("Playlist",uicmd_void));
				resultcontainer.genre = resultcontainer.appendChild(fn_element_add("Genre",uicmd_void));
				resultcontainer.playlistsongs = resultcontainer.appendChild(fn_element_add("PlaylistSongs",uicmd_void));
				resultcontainer.year = resultcontainer.appendChild(fn_element_add("Year",uicmd_void));
				resultcontainer.date = resultcontainer.appendChild(fn_element_add("Date",uicmd_void));
				
				keyboard = objMenuSearch.appendChild(fn_element_add("Keyboard"));
				
				
				footermenu = objMenuSearch.appendChild(fn_element_add("FooterMenu",uicmd_void));
				footerbtn[0] = footermenu.appendChild(fn_element_add("FooterButton_0",uicmd_void));
				footerbtn[1] = footermenu.appendChild(fn_element_add("FooterButton_1",uicmd_void));
				footerbtn[2] = footermenu.appendChild(fn_element_add("FooterButton_2",uicmd_void));
				footerbtn[3] = footermenu.appendChild(fn_element_add("FooterButton_3",uicmd_void));
				footerbtn[4] = footermenu.appendChild(fn_element_add("FooterButton_4",uicmd_void));
				volscroller.innerHTML="volume";
				volume_startpos = voltouchlayer.offsetTop + 30;
				volume_endpos = voltouchlayer.offsetTop + voltouchlayer.offsetHeight - 30;

				
			}
			with(objMenuCoverflow){
				setAttribute("IDA", uicmd_home);
				appendChild(fn_element_add("hier is nog nix",uicmd_home));
			}
			fn_uimenu(uicmd_home);
			fn_displayresults(db_browse_year,"")
			//fn_displayresults(db_browse_genre,"")
			//fn_displayresults(db_playlist_list,"")			
		}	
	}
