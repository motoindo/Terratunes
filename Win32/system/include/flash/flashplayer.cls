	this.getUpdate = function(typ,pr1,pr2)
	{
//		this function handles callback updates from the flashplayer, needs to reside outside the class because it's referenced directly from the flashcode
		with(this)
		{
			var iTime = 0;
			switch(typ)
			{
				case "time":	
						FlashPlayer.intDuration = Math.round(pr1 + pr2)
						if(FlashPlayer.bSendPlayerUpdates) TellaVision.fn_update_playscroller(Math.round((pr1 / (pr1 + pr2)) * 100))
						FlashPlayer.currentPosition = pr1;
						break
				case "volume":	FlashPlayer.currentVolume = pr1;break
				case "item":	FlashPlayer.getItemData(pr1);break
				case "state":	FlashPlayer.currentstate = pr1;
								switch(pr1)
								{
									//case 0:	break	// paused
									//case 1:	buffering");break
									case 2: if(percentLoaded == 100 && FlashPlayer.bSendPlayerUpdates) TellaVision.fn_update_playscroller_loadmedia(percentLoaded);
											break	// playing
									case 3:	//TellaVision.fn_play_next_entry();
											//TellaVision.fn_display_status(TellaVision.SongInfo(DataCommand.recCurrent.Data))
											//FlashPlayer.LoadStream(TellaVision.objTarget_Content_CurrentItem.intID);
											//alert(TellaVision.objTarget_Content_CurrentItem.intID)
											//var fiets = setTimeout("FlashPlayer.mpPlay()",100);
											break				//">Toggle the pause state</a>.</li>
								}
								break
				case "size":	currentSize =  pr1; break
				case "load":	percentLoaded = parseInt(pr1);
								//if(TellaVision.bUIready && FlashPlayer.bSendPlayerUpdates) TellaVision.fn_update_playscroller_loadmedia(percentLoaded);
								break	//alert("load:" + pr1 + " - " + pr2);
				default : 		alert(type + ":" + pr1 + " - " + pr2);break
			}
		}
	}

	function clsFlashPlayer()
	{
		this.currentPosition = 0;
		this.percentLoaded = 0;
		this.currentSize = 0;
		this.intDuration = 0;
		this.currentVolume = 0;
		this.currentItem;
		this.objPlayer = Object;
		this.currentstate = 0;
		this.bSendPlayerUpdates = false;


	
		this.sendEvent = function(typ,prm)
		{
			with(this)
			{
				thisMovie($("dvPlayer")).sendEvent(typ,prm);
			}
		}

		this.xLoad = function(ID)
		{
			with(this)
			{
				percentLoaded = 0;
				thisMovie($("dvPlayer")).loadFile({file:DataCommand.fnSystem_GetMediaUrl(ID)}); 
				sendEvent('playpause')
			}
		}
		
		this.Load = function(ID)
		{
			with(this)
			{
				LoadStream(ID); 
				//sendEvent('playpause')
			}
		}
		this.LoadStream = function(ID)
		{
			with(this)
			{
				//TellaVision.fn_clear_playscroller()
				percentLoaded = 0;
//				alert('{file:"sys.stream?"+' + ID + '}')
				thisMovie($("dvPlayer")).loadFile({file:"sys.stream?"+ ID}); 
			}
		}
	
		
		this.addItem = function(obj,idx)
		{
			with(this)
			{
				thisMovie($("dvPlayer")).addItem(obj,idx);
			}
		}
		
		this.removeItem = function(idx)
		{
			with(this)
			{
				thisMovie($("dvPlayer")).removeItem(idx);
			}
		}
		
		this.getItemData = function(idx)
		{
			with(this)
			{
				/*
				var obj = thisMovie($("dvPlayer")).itemData(idx);
				var nodes = "";
				for(var i in obj) nodes += "<li>"+i+": "+obj[i]+"</li>"; 
				document.getElementById("data").innerHTML = nodes;
				*/
			}
		}

		// This is a javascript handler for the player and is always needed.
		
		this.thisMovie = function(movieName) 
		{
			with(this)
			{
				if(navigator.appName.indexOf("Microsoft") != -1) 
				{
					return window[movieName];
				} 
				else
				{
					return document[movieName];
				}
			}
		}
	
	
		this.fn_initialize = function(idPlayer,width,height)
		{
			with(this)
			{
				var objPlayer = new SWFObject('/include/flash/mp3player.swf',idPlayer,width,height,'8');
				objPlayer.addParam("allowfullscreen","true");
				objPlayer.addVariable("volume","100");
				objPlayer.addVariable("enablejs","true");
				objPlayer.addVariable("displayheight","0");
				objPlayer.addVariable("shownavigation","true");
				objPlayer.addVariable("showdownload","false");
				objPlayer.addVariable("type","mp3");
				//so.addVariable("file",fil);
				objPlayer.addVariable("start","5");
				objPlayer.addVariable("autostart","false");
				objPlayer.addVariable("usefullscreen","false");
				//so.addVariable("fsbuttonlink","fullscreen.html%3Ffile%3D"+fil+"%26id%3D"+id+"%26stream%3D"+str);
				objPlayer.addVariable("id",idPlayer); 
				//objPlayer.addVariable("streamscript",''); 
				objPlayer.write(idPlayer);
			}
		}
		this.Stop = function()
		{
			with(this)
			{
				thisMovie($("dvPlayer")).sendEvent('stop',0);							//">Stop loading and playing</a>.</li>
			}
		}
		

		this.mpPlay = function(prm)
		{
			with(this)
			{
				thisMovie($("dvPlayer")).sendEvent('playpause',prm);					//">Toggle the pause state</a>.</li>
			}
		}
		
		this.mpPrev = function()
		{
			with(this)
			{
				thisMovie($("dvPlayer")).sendEvent('prev',0);							//">Play the previous item</a>.</li>
			}
		}
		
		this.mpNext = function()
		{
			with(this)
			{
				thisMovie($("dvPlayer")).sendEvent('next',0);							// ">Play the next item</a>.</li>
			}
		}
		
		this.mpSeek = function(iVal)
		{
			with(this)
			{
				thisMovie($("dvPlayer")).sendEvent('scrub',iVal)		//">Scrub 5 seconds forward</a>.</li>
			}
		}

		this.mpFwSeek = function()
		{
			with(this)
			{
				thisMovie($("dvPlayer")).sendEvent('scrub',currentPosition + 5)		//">Scrub 5 seconds forward</a>.</li>
			}
		}
		
		this.mpRvSeek = function()
		{
			with(this)
			{
				thisMovie($("dvPlayer")).sendEvent('scrub',currentPosition - 5);	//">Scrub 5 seconds backward</a>.</li>
			}
		}
		
		this.mpSetVolume = function(iVol)
		{
			with(this)
			{
				thisMovie($("dvPlayer")).sendEvent('volume',iVol);	//">Increase the volume 10%</a></li>
			}
		}

		this.mpIncVolume = function()
		{
			with(this)
			{
				thisMovie($("dvPlayer")).sendEvent('volume',currentVolume + 10);	//">Increase the volume 10%</a></li>
			}
		}
		
		this.mpDecVolume = function()
		{
			with(this)
			{
				thisMovie($("dvPlayer")).sendEvent('volume',currentVolume - 10);	//">Decrease the volume 10%</a></li>
			}
		}
		
		this.mpPlayItem = function()
		{
			with(this)
			{
				thisMovie($("dvPlayer")).sendEvent('playitem',1);					//">Play the 2nd item of the playlist</a>.</li>
			}
		}
		
		this.mpGetLink = function()
		{
			with(this)
			{
				thisMovie($("dvPlayer")).sendEvent('getlink',1);	//">Go to the 2nd link of the playlist</a>.</li>
			}
		}
		

	}
				
