/*
    Select an existing token, then call !spawn --name|<CharToSpawn> --optionalArgs
    
    Description of of syntax:
    !Spawn {{
      --name|        < charName >    //(REQUIRED) name of the character whose target we want to spawn
      --targets|     < # >           //Destination override. Instead of using selected token(s) as origin, use target token(s)
      --qty|         < # >           //How many tokens to spawn at each origin point. DEFAULT =
      --offset|	 < #,# >         //X,Y pos or neg shift in position of the spawn origin point(s) relative to the origin token(s), in number of SQUARES 
                                            //DEFAULT = 0,0  // (NOTE: a POSITIVE Y offset means LOWER on the map)
      --placement|   < option >      //How to arrange the tokens relative to the origin point (+ offset)
                                            //'stack'      : (DEFAULT) All tokens will be stacked on top of each other
                                            //'row'        : A horizontal row of tokens
                                            //'column,col' : A vertical column of tokens
                                            //'surround'   : A clockwise spiral placement around origin token, starting at top  (NOTE: any supplied offset will be ignored)
                                            //'grid #'     : A square grid with "#" tokens per row. Raster left to right
                                            //'burst #'    : An expanding diagonal distribution of tokens starting "#" squares from the 4 origin token corners. Large qty will form an "X" pattern
                                            //'cross #'    : "evenly" distributed vert/horiz qty, starting directly above origin by # squares. Large qty will form a "+" pattern
                                            //'random,rand #' : randomly populates tokens within a (# by #) square grid
      --size|        < #,# >                //DEFAULT = 1,1 (X,Y) - How many SQUARES wide and tall are the spawned tokens?
      --side|        < # or rand>           //DEFAULT = 1. Sets the side of a rollable table token. 
                                                    // #              : Sets the side of all spawned tokens to "#"
                                                    // 'rand,random'  : Each spawned token will be set to a random side
      --order|       < option >             //The z-order of the token. (NOTE: a recent Roll20 "feature" will always put character tokens with sight above those without, so YMMV.)
                                                    // toFront,front,top,above  : Spawn token moved to front
                                                    // toBack,back,bottom,below : Spawn token moved to back
      --light|       < #,# >                //Set light radius that all players can see. 
                                                    //For Legacy Dynamic Lighting (LDL):
                                                        //First # is the total radius of the light (light_radius)
                                                        //Second # is the start of dim light (light_dimradius) (so: 10,5 will be 10 ft of total light, with dim radius starting at 5ft)
                                                    //For Updated Dynamic Lighting (UDL):
                                                        //First # is the radius of bright light (bright_light_distance)
                                                        //Second # is the additional radius of dim light (so: 10,5 will be 10ft of bright light + 5ft of dim light)
      --mook|        < yes/true/1/no/false/0 >      //DEFAULT = false (the "represents" characteristic of the token is removed so changes to one linked attribute, e.g. hp, will not propagate to other associated tokens.
                                                        //If set to true, linked attributes will affect all tokens associated with that sheet
      --force|       < yes/true/1/no/false/0 >      //DEFAULT = false. The origin point is by default relative to the geometric center of the origin token
                                                        //Origin tokens of larger than 1x1 may spawn tokens in between squares, which may be strange depending on the specific case
                                                        //Set to true in order to force the token to spawn in a full square
      --sheet|       < charName2 >          //DEFAULT = selected character. The character sheet in which to look for the supplied ability
                                                    //useful if the ability exists on a "macro mule" or simply another character sheet
      --ability|     < abilityName >        //The ability to trigger after spawning occurs. With caveats s described below
      --fx|          < type-color >         //Trigger FX at each origin point.
                                                    //Supported types are: bomb,bubbling,burn,burst,explode,glow,missile,nova,splatter
                                                    //Supported colors are: acid,blood,charm,death,fire,frost,holy,magic,slime,smoke,water
      --bar1|        < currentVal/optionalMax optional "KeepLink">            //overrides the token's bar1 current and max values. Max is optional. Default is to remove bar1_link. If "KeepLink" is appended, the bar1_link will be preserved 
      --bar2|        < currentVal/optionalMax optional "KeepLink">            //overrides the token's bar2 current and max values. Max is optional. Default is to remove bar2_link. If "KeepLink" is appended, the bar2_link will be preserved
      --bar3|        < currentVal/optionalMax optional "KeepLink">            //overrides the token's bar3 current and max values. Max is optional. Default is to remove bar3_link. If "KeepLink" is appended, the bar3_link will be preserved
      --expand|      < #frames, delay, optional yes/true/1 >         //DEFAULT = 0,0,false. Animates the token during spawn. Expands from size = 0 to max size. If third param =true, will delete spawned token after animation completes
                                                        //#frames: how many frames the expansion animation will use. Start with something like 20
                                                        //delay: how many milliseconds between triggering each frame? Start with something like 50. Any less than 30 may appear instant
      --deleteSource|  < yes/true/1/no/false/0 >    //DEFAULT = false. Deletes the selected token(s) upon spawn
      --deleteTarget|  < yes/true/1/no/false/0 >    //DEFAULT = false. Deletes the target token(s) upon spawn
      --resizeSource|  < #,# <optional #frames, #delay> >    //DEFAULT = n/a. Animates the selected token(s) during spawn. 
                                                        //#,#: the new size of the selected token(s). If any dimension is set to 0, it will delete the token after animation
                                                        //#frames: DEFAULT = 20. how many frames the animation will use.
                                                        //delay: DEFAULT = 50. how many milliseconds between triggering each frame? Anything less than 30 may appear instant
      --resizeTarget|  < #,# <optional #frames, #delay> >    //DEFAULT = n/a. Animates the target token(s) during spawn. 
                                                        //#,#: the new size of the target token(s). If any dimension is set to 0, it will delete the token after animation
                                                        //#frames: DEFAULT = 20. how many frames the animation will use.
                                                        //delay: DEFAULT = 50. how many milliseconds between triggering each frame? Anything less than 30 may appear instant
      --layer| < object/token/map/gm >                  //DEFAULT = token(s) spawn on the same layer as the selected token(s). May explicitly set to spawn on a different layer.
      --tokenName| < some name >                        //optional override for the token name - allows token name to be different than the character name
      --controlledby| <optional +> <comma-delimited list of playerIDs or displayNames>   //adds or replaces the  controlledby property of the CHARACTER SHEET defined by the --name command
      --tokenProps|<prop1:val1,prop2:val2...>           //sets various token properties. Valid properties include:
                                                            name,statusmarkers,bar1_value,bar1_max,bar2_value,bar2_max,bar3_value,bar3_max,top,left,
                                                            width,height,rotation,layer,aura1_radius,aura1_color,aura2_radius,aura2_color,aura1_square,
                                                            aura2_square,tint_color,light_radius,light_dimradius,light_angle,light_losangle,light_multiplier,
                                                            light_otherplayers,light_hassight,flipv,fliph,bar1_link,bar2_link,bar3_link,represents,layer,
                                                            isdrawing,name,gmnotes,showname,showplayers_name,showplayers_bar1,showplayers_bar2,showplayers_bar3,
                                                            showplayers_aura1,showplayers_aura2,playersedit_name,playersedit_bar1,playersedit_bar2,
                                                            playersedit_bar3,playersedit_aura1,playersedit_aura2,lastmove,tooltip,show_tooltip,
                                                            adv_fow_view_distance,has_bright_light_vision,has_night_vision,night_vision_distance,
                                                            emits_bright_light,bright_light_distance,emits_low_light,low_light_distance,has_limit_field_of_vision,
                                                            limit_field_of_vision_center,limit_field_of_vision_total,has_limit_field_of_night_vision,
                                                            limit_field_of_night_vision_center,limit_field_of_night_vision_total,has_directional_bright_light,
                                                            directional_bright_light_center,directional_bright_light_total,has_directional_dim_light,
                                                            directional_dim_light_center,directional_dim_light_total,bar_location,compact_bar,
                                                            light_sensitivity_multiplier,night_vision_effect,lightColor
    }}
    
    
*/
// adding API_Meta for line offset
var API_Meta = API_Meta || {};
API_Meta.SpawnWIP = { offset: Number.MAX_SAFE_INTEGER, lineCount: -1 };
{
    try { throw new Error(''); } catch (e) { API_Meta.SpawnWIP.offset = (parseInt(e.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/, '$1'), 10) - (71)); }
}
//        log(`SpawnWIP Offset: ${API_Meta.SpawnWIP.offset}`);

const SpawnDefaultToken = (() => {
    
    const scriptName = "SpawnDefaultToken";
    const version = '0.24';
    var gridSize = 70;  //this may be updated based on page settings 
    
    //an array of token properties which may be set for Spawned tokens
	var tokenAttributes = ['name','statusmarkers','bar1_value','bar1_max','bar2_value','bar2_max','bar3_value','bar3_max','top','left','width','height','rotation','layer','aura1_radius','aura1_color','aura2_radius','aura2_color','aura1_square','aura2_square','tint_color','light_radius','light_dimradius','light_angle','light_losangle','light_multiplier','light_otherplayers','light_hassight','flipv','fliph','bar1_link','bar2_link','bar3_link','layer','isdrawing','name','gmnotes','showname','showplayers_name','showplayers_bar1','showplayers_bar2','showplayers_bar3','showplayers_aura1','showplayers_aura2','playersedit_name','playersedit_bar1','playersedit_bar2','playersedit_bar3','playersedit_aura1','playersedit_aura2','lastmove','tooltip','show_tooltip','adv_fow_view_distance','has_bright_light_vision','has_night_vision','night_vision_distance','emits_bright_light','bright_light_distance','emits_low_light','low_light_distance','has_limit_field_of_vision',' limit_field_of_vision_center',' limit_field_of_vision_total',' has_limit_field_of_night_vision',' limit_field_of_night_vision_center',' limit_field_of_night_vision_total',' has_directional_bright_light','directional_bright_light_center','directional_bright_light_total','has_directional_dim_light','directional_dim_light_center','directional_dim_light_total','bar_location','compact_bar','light_sensitivity_multiplier','night_vision_effect','lightColor'];
	
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //Due to a bug in the API, if a @{target|...} is supplied, the API does not acknowledge msg.selected anymore
        //This code block helps enable the user to pass both selected and target info into the script
            //---The initial api call will create a chat button that stores the original msg.content & selected tokenID as a "memento"...
                //...clicking this button will trigger a second api call that will prompt for a number of targets. 
                    //"--qty" number of tkens will spawn for EACH origin token (determined by selected or targeted)
                    //Trick developed by TheAaron. 
                    //Forum thread here : https://app.roll20.net/forum/post/8998098/can-you-pass-both-a-selected-and-target-tokenid-to-an-api-script/?pageforid=8998098#post-8998098
                
        //----------------------------------------------------------------------------
        // Registry functions for storing an object and retrieving it by ID
        let store;
        let retrieve;
        
        // destructing assignment of two functions
        [store,retrieve] = (() => {
            // closure containing the id counter and storage for msgs
            const mementos = {};
            let num = 0;
            
            return [
                /* store */ (msg) => {
                    mementos[++num] = msg;
                    return num;
                },
                /* retrieve */ (mid) => {
                    let m = mementos[mid];
                    delete mementos[mid];
                    return m;
                }
            ];
        })();
        
        // making an array of numbers from 1..n
        const range = (n)=>[...Array(n+1).keys()].slice(1);
    //----------------------------------------------------------------------------
    
    const checkInstall = function() {
        log(scriptName + ' v' + version + ' initialized.');
        log(`SpawnWIP Offset: ${API_Meta.SpawnWIP.offset}`);

    };
    
    function processInlinerolls(msg) {
    	if(_.has(msg,'inlinerolls')){
    		return _.chain(msg.inlinerolls)
    		.reduce(function(m,v,k){
    			var ti=_.reduce(v.results.rolls,function(m2,v2){
    				if(_.has(v2,'table')){
    					m2.push(_.reduce(v2.results,function(m3,v3){
    						m3.push(v3.tableItem.name);
    						return m3;
    					},[]).join(', '));
    				}
    				return m2;
    			},[]).join(', ');
    			m['$[['+k+']]']= (ti.length && ti) || v.results.total || 0;
    			return m;
    		},{})
    		.reduce(function(m,v,k){
    			return m.replace(k,v);
    		},msg.content)
    		.value();
    	} else {
    		return msg.content;
    	}
    }
    
    const getCleanImgsrc = function (imgsrc) {
        let parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^\?]*)(\?[^?]+)?$/);
            if(parts) {
                return parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
            }
        return;
    };
    
    function round(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }
    
    async function resizeToken (tok, iterations, delay, start_W, start_H, end_W, end_H, destroyWhenDone=false) {
        let new_W = start_W;
        let new_H = start_H;
        
        let incrementX = Math.abs(start_W-end_W) * (1 / iterations);  // size expansion factor.
        let incrementY = Math.abs(start_H-end_H) * (1 / iterations);  // size expansion factor.  
        
        while (new_W !== end_W && new_H !== end_H) {
            promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (start_W > end_W) {    //shrink X
                        new_W = Math.max(new_W - incrementX, end_W)
                    } else {                //grow X
                        new_W = Math.min(new_W + incrementX, end_W)
                    }
                    if (start_H > end_H) {    //shrink Y
                        new_H = Math.max(new_H - incrementY, end_H)
                    } else {                //grow Y
                        new_H = Math.min(new_H + incrementY, end_H)
                    }
                    
                    tok.set({
                        width: new_W,
                        height: new_H
                    });
                    //tok.set("width", new_W);
                    //tok.set("height", new_H);
                    
                    resolve("done!");
                }, delay);
            });
            
            result = await promise;
           
        }
        
        if (new_W <= 0 || new_H <= 0 || destroyWhenDone) {
            tok.remove();
        } 
        return;
    }
    
    //This function runs asynchronously, as called from the processCommands function
    //We will sendChat errors, but the rest of processCommands keeps running :(
    function spawnTokenAtXY (who, tokenJSON, pageID, spawnLayer, spawnX, spawnY, currentSideNew, sizeX, sizeY, zOrder, lightRad, lightDim, mook, UDL, bar1Val, bar1Max, bar1Link, bar2Val, bar2Max, bar2Link, bar3Val, bar3Max, bar3Link, expandIterations, expandDelay, destroyWhenDone, angle, isDrawing, tokenName, tooltip, tokenPropValPairs) {
        let newSideImg;
        let spawnObj;
        let currentSideOld;
        let imgsrc;
        let sides;
        let sidesArr;
        let iLightRad;
        let iLightDim;      
        let result;
                
        try {
            let baseObj = JSON.parse(tokenJSON);
            //log(baseObj);
            //set token properties
            baseObj.pageid = pageID;
            baseObj.layer = spawnLayer;
            if (expandIterations === 0) {       //spawn full-sized token 
                baseObj.left = spawnX;
                baseObj.top = spawnY;
                baseObj.width = sizeX;
                baseObj.height = sizeY;
                baseObj.rotation = angle;
                baseObj.isdrawing = isDrawing;
                if (tokenName !== '') { baseObj.name = tokenName }
            } else {                            //will animate and expand token to full size after spawning
                baseObj.left = spawnX;
                baseObj.top = spawnY;
                baseObj.width = 0;
                baseObj.height = 0;
                baseObj.rotation = angle;
                baseObj.isdrawing = isDrawing;
                if (tokenName !== '') { baseObj.name = tokenName }
            }
            
            baseObj.imgsrc = getCleanImgsrc(baseObj.imgsrc); //ensure that we're using the thumb.png
            
            //image must exist in personal Roll20 image library 
            if (baseObj.imgsrc ===undefined) {
                sendChat('SpawnAPI',`/w "${who}" `+ 'Unable to find imgsrc for default token of \(' + baseObj.name + '\)' + "<br>" + 'You must use an image file that has been uploaded to your Roll20 Library.')
                return;
            }
            
            //check for mook
            if (mook === true) {
                baseObj.bar1_link = "";
                baseObj.bar2_link = "";
                baseObj.bar3_link = "";
            }
            
            //token bar overrides
            if (bar1Val !== "") {
                baseObj.bar1_value = bar1Val;
                if (bar1Link === false) {baseObj.bar1_link = ""}
            }
            if (bar1Max !== "") {
                baseObj.bar1_max = bar1Max;
            }
            
            if (bar2Val !== "") {
                baseObj.bar2_value = bar2Val;
                if (bar2Link === false) {baseObj.bar2_link = ""}
            }
            if (bar2Max !== "") {
                baseObj.bar2_max = bar2Max;
            }
            
            if (bar3Val !== "") {
                baseObj.bar3_value = bar3Val;
                if (bar3Link === false) {baseObj.bar3_link = ""}
            }
            if (bar3Max !== "") {
                baseObj.bar3_max = bar3Max;
            }
            
            //Get page lighting mode (UDL vs LDL)
            var page = findObjs({                              
              _id: pageID,                        
            });
            let UDL = page[0].get("dynamic_lighting_enabled");
            
            //set emitted light
            if (UDL && lightRad !== -999) {
                //Updated Dynamic Lighting
                iLightRad = parseInt(lightRad);
                iLightDim = parseInt(lightDim);
                
                if (iLightRad === 0) {baseObj.emits_bright_light = false;}
                if (iLightDim === 0) {baseObj.emits_low_light = false;}
                
                if (lightRad !== "" && iLightRad > 0) {
                    baseObj.emits_bright_light = true;
                    baseObj.bright_light_distance = lightRad
                }
                if (lightDim !== "" && iLightDim > 0) {
                    baseObj.emits_low_light = true;
                    baseObj.low_light_distance = (iLightRad + iLightDim).toString();
                }
            } else if (lightRad !== -999) {
                //Legacy Dynamic Lighting
                baseObj.light_radius = lightRad;
                baseObj.light_dimradius = lightDim;
                baseObj.light_otherplayers = true;
            }
            
            
            //Check for rollable table token and side selection
            if (baseObj.hasOwnProperty('sides')) {
                sidesArr=baseObj["sides"].split('|');
                if ( (currentSideNew !== -999) && (sidesArr[0] !== '') ) {
                    
                    //check for random side
                    if ( isNaN(currentSideNew) ) {
                        currentSideNew = randomInteger(sidesArr.length) - 1;    // Setting to random side. currentSide is 1-based for user
                    } else {
                        currentSideNew = parseInt(currentSideNew) - 1;          //currentSide is 1-based for user
                    }
                    
                    //set the current side (wtih data validation for the requested side)
                    if ( (currentSideNew > 0) || (currentSideNew <= sidesArr.length-1) ) {
                        newSideImg = getCleanImgsrc(sidesArr[currentSideNew]);     //URL of the image
                        baseObj["currentSide"] = currentSideNew;
                        baseObj["imgsrc"] = newSideImg;
                    } else {
                        sendChat('SpawnAPI',`/w "${who}" `+ 'Error: Requested index of currentSide is invalid');
                        return retVal;
                    }
                }
            }
            
            if (tooltip) {
                baseObj.tooltip = tooltip;
                baseObj.show_tooltip = true;
            }
            
            if (tokenPropValPairs) {
                tokenPropValPairs.forEach(pair => {
                    if (pair.indexOf(':') !== -1) {
                        let pairArr = pair.split(":")
                        let prop = pairArr[0].trim();
                        if (tokenAttributes.includes(prop)) {
                            baseObj[prop] = pairArr[1];
                        }
                    }
                });
            }
            ////////////////////////////////////////////////////////////
            //      Spawn the Token!
            ////////////////////////////////////////////////////////////
            spawnObj = createObj('graphic',baseObj);
            
            //---------------------------------------------------------
            //Support for TokenNameNumber script by TheAaron
            //  Triggers a global function in v0.5.12 or later of his script to rename the token
            if (baseObj.name) {
                if (baseObj.name.match( /%%NUMBERED%%/ ) ) {
                    processCreated = (( 'undefined' !== typeof TokenNameNumber && TokenNameNumber.NotifyOfCreatedToken ) 
                		? TokenNameNumber.NotifyOfCreatedToken
                		: _.noop ),
            	
                    processCreated(spawnObj);
                }
            }
            //---------------------------------------------------------
            
            //set the z-order
            switch (zOrder) {
                case 'toBack':
                    toBack(spawnObj);
                    break;
                default:
                    toFront(spawnObj);
                    break;
            }
            
            //check for expanding token size
            
            if (expandIterations > 0) {
                resizeToken(spawnObj, expandIterations, expandDelay, 0, 0, sizeX, sizeY, destroyWhenDone);
                /*
                let new_W, new_H;
                
                let factor = 1 / expandIterations;  // size expansion factor.  
                
                while (spawnObj.get("width") <= sizeX) {
                    promise = new Promise((resolve, reject) => {
                        setTimeout(() => {
                            new_W = Math.min(spawnObj.get("width") + sizeX * factor, sizeX)
                            new_H = Math.min(spawnObj.get("height") + sizeY * factor, sizeY)
                            
                            spawnObj.set("width", new_W);
                            spawnObj.set("height", new_H);
                            //spawnObj.set("width", spawnObj.get("width") + sizeX * factor);
                            //spawnObj.set("height", spawnObj.get("height") + sizeX * factor);
                            resolve("done!");
                        }, expandDelay);
                    });
                    
                    result = await promise;
                }
                if (spawnObj.get("width") > sizeX) {
                    spawnObj.set("width", sizeX);
                }
                if (spawnObj.get("height") > sizeY) {
                    spawnObj.set("height", sizeY);
                }
                */
            }
            
        }
        catch(err) {
          sendChat('SpawnAPI',`/w "${who}" `+ 'Unhandled exception: ' + err.message)
        }
    };
    
    //returns character object for given token
    const getCharacterFromToken = function (tokenObj) {
        let charID = tokenObj.get("represents");
        character = getObj("character", charID);
        return character;
    };
    
    //returns character object for given name
    const getCharacterFromName = function (charName) {
        let character = findObjs({
            _type: 'character',
            name: charName
        }, {caseInsensitive: true})[0];
        return character;
    };
    
    //returns ability object for given characterID and ability name
    const getAbilityFromName = function (charID, abilityName) {
        let ability = findObjs({
            _type: 'ability',
            _characterid: charID,
            name: abilityName
        }, {caseInsensitive: true})[0];
        return ability;
    };
    
    //returns a string value: either 'true', or an appropriate errorString if a prior findObjs returned undefined
    const validateObject = function (who, obj, type, name) {
        let retValue
        if (typeof obj !== 'undefined') {
            retValue = 'true';  //Success!
        } else {
            switch(type) {
                case "character":
                    retValue = 'character \"' + name + '\" not found';
                    break;
                case "ability":
                    retValue = 'ability \"' + name + '\" not found';
                    break;
                default:
                    retValue = 'object not defined';
                    break;
            }
            //sendChat('SpawnAPI',`/w "${who}" `+ 'Error: ' + retValue); //send error msg
        }
        return retValue;
    };
    
    //Returns an array of x,y coordinate objects corresponding to the squares surrounding the origin token.
        //Based on size of token. Spirals clockwise a number of squares = qty
        //starts one square to the right of upper left corner (so, directly above a 1x1 token, left top of larger token), and spirals clockwise
        //Examples:   1x1 token         2x2 token
                    
                    //  9--> etc.       13	14--> etc.
                    //  8   1   2       12	1	2	3
                    //  7   --  3       11	--  --  4
                    //  6   5   4       10	--  --	5
                    //                  9	8	7	6
                    
    const GetSurroundingSquaresArr = function (qty, tok) {
        function pt(x,y) {
            this.x = x,
            this.y = y
        };
        let pts = [];
        
        let originX = tok.get("left");
        let originY = tok.get("top");
        let w = parseFloat(tok.get("width"));
        let h = parseFloat(tok.get("height"));
        
        let startX
        let startY
        if ( (w/gridSize)%2 === 0 ) {     //width is an even number of squares
            startX = originX - w/2 + gridSize/2;
            startY = originY - h/2 - gridSize/2;
        } else {                    //width is an odd number of squares
            startX = originX;
            startY = originY - h/2 - gridSize/2;
        }
            
        let x = startX; 
        let y = startY;
        
        //Nested loops to generate coordinates
        let done = false;
        let i = 0;
        while (i < qty) {
            //go across right until upper right corner
            while ( (x < originX + w/2 + gridSize/2) && (i < qty) ) {
                pts.push( new pt(x,y) );
                if (i === qty) {done = true;}
                x += gridSize;
                i++;
            }
            if (done === true) {break;}
            
            //go down until lower right corner
            while ( y < originY + h/2 + gridSize/2 && i < qty ) {
                pts.push( new pt(x,y) );
                if (i === qty) {done = true;}
                y += gridSize;
                i++;
            }
            if (done === true) {break;}
            
            //go across left until lower left corner
            while ( x > originX - w/2 - gridSize/2 && i < qty ) {
                pts.push( new pt(x,y) );
                if (i === qty) {done = true;}
                x -= gridSize;
                i++;
            }
            if (done === true) {break;}
            
            //go up until just past upper left corner
            while ( y > originY - h/2 - gridSize*1.5 && i < qty ) {
                pts.push( new pt(x,y) );
                if (i === qty) {done = true;}
                y -= gridSize;
                i++;
            }
            if (done === true) {break;}
            
            //We've gone all the way around the token. Now continue spiraling with a larger radius
            w = w + gridSize*2;
            h = h + gridSize*2;
        }
        
        return pts;
    };
    
    //Similar to GetSurroundingSquaresArr function above, but just returns an array of rastering grid coords with numCols tokens per row
    const GetGridArr = function (qty, startX, startY, numCols) {
        function pt(x,y) {
            this.x = x,
            this.y = y
        };
        let pts = [];
        
        let x = startX; 
        let y = startY;
        
        let done = false;
        let i = 0;
        let c = 0;
        
        //Nested loops to generate coordinates
        while (i < qty) {
            while ( (c < numCols) && (i < qty) ) {
                pts.push( new pt(x,y) );
                if (i === qty) {done = true;}
                x += gridSize;
                c++;
                i++;
            }
            if (done === true) {break;}
            
            //Next row
            x -= numCols*gridSize;
            y += gridSize;
            c = 0;
        }
        
        return pts;
    };
    
    //Places tokens in random squares within a (numCols x numCols) grid
    const GetRandArr = function (qty, startX, startY, numCols) {
        function pt(x,y) {
            this.x = x,
            this.y = y
        };
        let pts = [];
        
        //first, populate all the coords as if the grid was filled completely
        let fullQty = numCols*numCols;
        let fullGridPts = GetGridArr(fullQty, startX, startY, numCols)
        
        for (let i=0; i<qty; i++) {
            let idx = randomInteger(fullGridPts.length) - 1;
            pts.push( fullGridPts[idx] );
            fullGridPts.splice(idx, 1);    //remove used array element
        }
        
        return pts;
    };
    
    //Similar to GetGridArr function above, but returns an array of coords "evenly" distributed at a certain burst radius...
    //      ... relative to the outer corner squares of the origin token (NOTE: when adjusted for offset, retains the "size" of origin token)
                    //  5           8
                    //    1       4
                    //       Tok  
                    //    3       2
                    //  7           6
    const GetBurstArr = function (qty, tok, rad, offsetX, offsetY) {
        function pt(x,y) {
            this.x = x,
            this.y = y
        };
        let pts = [];
        
        
        let originX = tok.get("left") + offsetX;
        let originY = tok.get("top") + offsetY;
        let w = parseFloat(tok.get("width"));
        let h = parseFloat(tok.get("height"));
        
        let xSpacing = (2 * rad)*gridSize + w - gridSize;
        let ySpacing = (2 * rad)*gridSize + h - gridSize;
        let startX = (originX - w/2 - gridSize/2) - (rad-1)*gridSize;;
        let startY = (originY - h/2 - gridSize/2)  - (rad-1)*gridSize;;
        let x;
        let y;
        
        let i = 0;
        
        while (i < qty) {
            x = startX; 
            y = startY; 
            
            for (let n = 0; n < 4; n++) {
                if (i < qty) {
                    switch (n) {
                        case 0:
                            pts.push( new pt(x,y) );
                            break;
                        case 1:
                            pts.push( new pt(x+xSpacing,y+ySpacing) );
                            break;
                        case 2:
                            pts.push( new pt(x,y+ySpacing) );
                            break;
                        case 3:
                            pts.push( new pt(x+xSpacing,y) );
                            break;
                    }
                }
            }
            xSpacing += gridSize*2;
            ySpacing += gridSize*2;
            startX -= gridSize;
            startY -= gridSize;
            i++;
        }
        return pts;
        
    };
    
    //Similar to GetBurstArr function above, but returns an array of coords "evenly" distributed in a "Plus" pattern at a certain radius...
    //      ... relative origin token (NOTE: when adjusted for offset, retains the "size" of origin token)
                    //         5
                    //         1
                    //    7 3 Tok 4 8  
                    //         2
                    //         6
    const GetCrossArr = function (qty, left, top, width, height, rad, force) {
        function pt(x,y) {
            this.x = x,
            this.y = y
        };
        let pts = [];
        
        let originX = left;
        let originY = top;
        
        let xSpacing = (2 * rad)*gridSize + width - gridSize;
        let ySpacing = (2 * rad)*gridSize + height - gridSize;
        
        
        let startX = originX;
        let startY 
        
        if ( (height/gridSize)%2===0 ) {
            if (force) {
                startY = originY -gridSize - Math.floor(height/2) - (rad-1)*gridSize;
            } else {
                startY = originY -gridSize/2 - Math.floor(height/2) - (rad-1)*gridSize;
            }
        } else {
            startY = originY - height/2 -gridSize/2 - (rad-1)*gridSize;
        }
      
        
        let x;
        let y;
        
        let revolutions = 0;
        let i = 0;
        
        while (i < qty) {
            x = startX; 
            y = startY; 
            
            for (let n = 0; n < 4; n++) {
                if (i < qty) {
                    switch (n) {
                        case 0:         //ABOVE
                            pts.push( new pt(x,y) );
                            break;
                        case 1:         //BELOW
                            pts.push( new pt(x,y+ySpacing) );
                            break;
                        case 2:         //LEFT
                            if ( (width/70)%2===0 ) {
                                if (force) {
                                    pts.push( new pt(x - gridSize - Math.floor(width/2) - (rad-1)*gridSize - revolutions*gridSize, originY ) );
                                } else {
                                    pts.push( new pt(x - width/2 -gridSize/2 - (rad-1)*gridSize - revolutions*gridSize, originY ) );
                                }
                            } else {
                                pts.push( new pt(x - gridSize/2 - Math.floor(width/2) - (rad-1)*gridSize - revolutions*gridSize, originY ) );
                            }
                            break;
                        case 3:         //RIGHT
                            pts.push( new pt( pts[pts.length-1].x + xSpacing, originY ) );
                            break;
                    }
                }
            }
            revolutions += 1;
            xSpacing += gridSize*2;
            ySpacing += gridSize*2;
            //startX -= 70;     //no X adjustment, start of each cross is just directly above the previous start
            startY -= gridSize;
            i++;
        }
        return pts;
        
    };
    
    const isNumber = function isNumber(value) {
       return typeof value === 'number' && isFinite(value);
    }
    
    //This is the primary worker function
    const processCommands = function(data, args) {
        let retVal = [];        //array of potential error messages to pass back to main handleInput funtion
        let validObj = "false"; //data validation string
        let o = 0;              //counter for originTok loops
        let q = 0;              //counter for spawn qty loops
        let fxModes = ['bomb', 'bubbling', 'burn', 'burst', 'explode', 'glow', 'missile', 'nova', 'splatter'];
        let fxColors = ['acid', 'blood', 'charm', 'death', 'fire', 'frost', 'holy', 'magic', 'slime', 'smoke', 'water'];
        let charControlledBy = [];
        let appendControlledBy = false;
        let pageGridIncrement = 1;
        
        try {
            //args is an array object full of cmd:params pairs
            //get rid of the api call !Spawn
            args.shift();
            
            if (args.length >= 1) {
                //assign values to our params arrray based on args
                args.forEach((arg) => {
                    let option = arg["cmd"].toLowerCase().trim();
                    let param = arg["params"].trim();
                    
                    switch(option) {
                        case "memento":
                        case "targs":
                            //In case somebody clicks the api chat button again (the oldMsg info has been deleted)
                            retVal.push('Cannot re-use the api chat button');
                            return retVal;
                            break;
                        case "targets":
                            //ignore this cmd from the original message, we already obtained targets from processing the api-generated chat button call 
                            break;
                        case "name":
                            data.spawnName = param;
                            break;
                        case "qty":
                            data.qty = parseInt(param) || 1;
                            break;
                        case "placement":
                            data.placement = param;
                            break;
                        case 'force':
                            if (_.contains(['true', 'yes', '1'], param.toLowerCase())) {
                                data.forceToSquare = true;
                            } else if (_.contains(['false', 'no', '0'], param.toLowerCase())) {
                                data.forceToSquare = false;
                            }
                            else {
                                retVal.push('Invalid force to square argument (\"' + param + '\"). Choose from: (' + data.validPlacements + ')');
                                return retVal;
                            }
                            break;
                        case "offset":
                            let direction = param.split(',');
                            data.offsetX = parseFloat(direction[0]);    //wil convert to pixels later
                            data.offsetY = parseFloat(direction[1]);    //wil convert to pixels later
                            break;
                        case "sheet":
                            data.sheetName = param;
                            break;
                        case "ability":
                            data.abilityName = param;
                            break;
                        case "side":
                            //either a number or ("random"/"rand"). Actually, any text will default to random
                            data.currentSide = parseInt(param) || param;
                            break;
                        case "size":
                            let sizes = param.split(',');
                            data.sizeX = parseFloat(sizes[0]);              //wil convert to pixels later
                            if (sizes.length > 1) {
                                data.sizeY = parseFloat(sizes[1]);          //wil convert to pixels later
                            } else {
                                data.sizeY = data.sizeX;
                            }
                            break;
                        case "order":
                            if (_.contains(['tofront', 'front', 'top', 'above'], param.toLowerCase())) {
                                data.zOrder = "toFront";
                            }
                            if (_.contains(['toback', 'back', 'bottom', 'below'], param.toLowerCase())) {
                                data.zOrder = "toBack";
                            }
                            break;
                        case "light":
                            let lights = param.split(',');
                            data.lightRad = lights[0];
                            data.lightDim = lights[1];
                            break;
                        case "mook":
                            //Default case is false. Only change if user requests false
                            if (_.contains(['true','yes', '1'], param.toLowerCase())) {
                                data.mook = true;
                            }
                            break;
                        case "bar1":
                            if (param.toLowerCase().includes('keeplink')) {
                                data.bar1Link = true;
                                param = param.replace(/keeplink/i,'').trim();
                            } else {
                                data.bar1Link = false;
                            }
                            let bar1 = param.split('/');
                            data.bar1Val = bar1[0].trim();
                            if (bar1.length > 1) {
                                data.bar1Max = bar1[1].trim();
                            } else {
                                data.bar1Max = data.bar1Val
                            }
                            break;
                         case "bar2":
                            if (param.toLowerCase().includes('keeplink')) {
                                data.bar2Link = true;
                                param = param.replace(/keeplink/i,'').trim();
                            } else {
                                data.bar2Link = false;
                            }
                            let bar2 = param.split('/');
                            data.bar2Val = bar2[0].trim();
                            if (bar2.length > 1) {
                                data.bar2Max = bar2[1].trim();
                            } else {
                                data.bar2Max = data.bar2Val
                            }
                            break;
                         case "bar3":
                             if (param.toLowerCase().includes('keeplink')) {
                                data.bar3Link = true;
                                param = param.replace(/keeplink/i,'').trim();
                            } else {
                                data.bar3Link = false;
                            }
                            let bar3 = param.split('/');
                            data.bar3Val = bar3[0].trim();
                            if (bar3.length > 1) {
                                data.bar3Max = bar3[1].trim();
                            } else {
                                data.bar3Max = data.bar3Val
                            }
                            break;
                        case "fx":
                            data.fx = param;
                            break;
                        case "expand":
                            let p = param.split(',').map(e=>e.trim());
                            data.expandIterations = parseInt(p[0]);
                            if (p.length > 1) {
                                data.expandDelay = parseInt(p[1]);
                            }
                            if (p.length > 2) {
                                if ( _.contains(['true','yes', '1'], p[2]) ) {
                                    data.destroySpawnWhenDone = true;
                                }
                            }
                            break;
                        case "deletesource":
                            if (_.contains(['true','yes', '1'], param.toLowerCase())) {
                                data.deleteSource = true;
                            }
                            break;
                        case "deletetarget":
                            if (_.contains(['true','yes', '1'], param.toLowerCase())) {
                                data.deleteTarget = true;
                            }
                            break;
                        case "resizesource":
                            let sourceSizes = param.split(',');
                            data.resizeSourceX = parseFloat(sourceSizes[0]);   //will convert to pixels later
                            data.resizeSourceY = parseFloat(sourceSizes[1]);   //will convert to pixels later
                            if (sourceSizes.length >2) {
                                data.resizeSourceIterations = parseInt(sourceSizes[2]);
                            }
                            if (sourceSizes.length >3) {
                                data.resizeSourceDelay = parseInt(sourceSizes[3]);
                            }
                            break;
                        case "resizetarget":
                            let targetSizes = param.split(',');
                            data.resizeTargetX = parseFloat(targetSizes[0]);    //will convert to pixels later
                            data.resizeTargetY = parseFloat(targetSizes[1]);    //will convert to pixels later
                            if (targetSizes.length >2) {
                                data.resizeTargetIterations = parseInt(targetSizes[2]);
                            }
                            if (targetSizes.length >3) {
                                data.resizeTargetDelay = parseInt(targetSizes[3]);
                            }
                            break;
                        case "rotation":
                            //either a number or ("random"/"rand"). Actually, any text will default to random
                            data.angle = parseInt(param) || param;
                            break;
                        case "layer":
                            //send token to object, gm, or map layer
                            data.spawnLayer = param;
                            data.userSpecifiedLayer = true;
                            break;
                        case "isdrawing":
                            //Default case is false. Only change if user requests false
                            if (_.contains(['true','yes', '1'], param.toLowerCase())) {
                                data.isDrawing = true;
                            }
                            break;
                        case "tokenname":
                            data.tokenName = param;
                            break;
                        case "tooltip":
                            data.tooltip = param;
                            break;
                        case "tokenprops":
                        case "tokenprop":
                            data.tokenPropValPairs = param.split(',');
                            data.tokenPropValPairs = data.tokenPropValPairs.map(s => s.replace('%comma%',','));
                            data.tokenPropValPairs.forEach(pair => {
                                let pairArr = pair.split(':');
                                let prop = pairArr[0].trim();
                                if (!tokenAttributes.includes(prop)) {
                                    retVal.push('Invalid token attribute requested (' + prop + ')');
                                }
                            });
                            break;
                        case "controlledby":
                            if (param.charAt(0)==='+') {
                                appendControlledBy = true;
                                param = param.substring(1);
                            }
                            let list = param.split(',').map(e=>e.trim());
                            let players=findObjs({_type:'player'});
                            list.forEach(item => {
                                if (item.toLowerCase().includes('all') && item.length===3) {
                                    charControlledBy.push('all');
                                } else {
                                    let playerID;
                                    let player = players.filter(p=>p.get('_id')===item);
                                    if (player.length > 0) {
                                        playerID = player[0].get('_id');
                                        charControlledBy.push(playerID);
                                    } else {
                                        player = players.filter(p=>p.get('_displayname')===item);
                                        if (player.length > 0) {
                                            playerID = player[0].get('_id');
                                            charControlledBy.push(playerID);
                                        } else {
                                            retVal.push('Invalid playerID or displayname (' + item + ') in --controlledby statement.)');
                                        }
                                    }
                                }
                            });
                            break;
                        default:
                            retVal.push('Unexpected argument identifier (' + option + '). Choose from: (' + data.validArgs + ')');
                            break;    
                    }
                }); //end forEach arg
            } else {
                retVal.push('No arguments supplied. Format is \"!Spawn --Command|Value\"');
                return retVal;
            }
            //First data validation checkpoint
            if (retVal.length > 0) {return retVal};
            
            //////////////////////////////////////////////////////
            //  Input commands are good. Validate input parameters
            //////////////////////////////////////////////////////
            //SpawnName is a required arg
            if (data.spawnName === "") {
                retVal.push('No spawn target identified. Argument \"spawn|characterName\" required');;
            }
            
            //"Placement" parameter. Additional checks if 'grid', 'burst', 'cross', or 'random' 
            if ( _.contains(['stack', 'row', 'col', 'column', 'surround'], data.placement.toLowerCase()) ) {
                //Good, no additional info req'd
            } else if ( data.placement.match(/grid/i) ) {
                    //grid case     --check for number
                    if ( !data.placement.match(/(\d+)/) ) {
                        retVal.push('Invalid grid row length supplied (\"' + data.placement + '\"). Format is --placement|grid #');
                    } else {        
                        //good grid #
                        data.gridCols = data.placement.match(/(\d+)/)[0];   //use first number found for gridCols
                        data.placement = 'grid';
                    }
            } else if ( data.placement.match(/burst/i) ) {  
                    //burst case    --check for number
                    if ( !data.placement.match(/(\d+)/) ) {
                        retVal.push('Invalid burst radius supplied (\"' + data.placement + '\"). Format is --placement|burst #');
                    } else {        
                        //good burst #
                        data.burstRad = data.placement.match(/(\d+)/)[0];   //use first number found for burstRad
                        data.placement = 'burst';
                    }
            }  else if ( data.placement.match(/cross/i) ) {  
                    //burst case    --check for number
                    if ( !data.placement.match(/(\d+)/) ) {
                        retVal.push('Invalid cross radius supplied (\"' + data.placement + '\"). Format is --placement|cross #');
                    } else {        
                        //good burst #
                        data.crossRad = data.placement.match(/(\d+)/)[0];   //use first number found for crossRad
                        data.placement = 'cross';
                    }
            }  else if ( data.placement.match(/rand/i) ) {
                    //random case     --check for number
                    if ( !data.placement.match(/(\d+)/) ) {
                        retVal.push('Invalid random grid row length supplied (\"' + data.placement + '\"). Format is --placement|random #');
                    } else if (data.qty > data.placement.match(/(\d+)/)[0]*data.placement.match(/(\d+)/)[0]) {
                        let numSquares = data.placement.match(/(\d+)/)[0] * data.placement.match(/(\d+)/)[0];
                        retVal.push('Input qty (\"' + data.qty + '\") exceeds the number of available grid squares(\"'+ numSquares + '\"). Consider increasing the grid size or reducing qty.');
                    } else {        
                        //good grid #
                        data.gridCols = data.placement.match(/(\d+)/)[0];   //use first number found for gridCols
                        data.placement = 'random';
                    }
            } else {
                retVal.push('Invalid placement argument (\"' + data.placement + '\"). Choose from: (' + data.validPlacements + ')');
            }
            
            //Check for valid offset X/Y (numeric)
            if (isNaN(data.offsetX) || isNaN(data.offsetY)) {
                retVal.push('Non-numeric offset detected. Format is \"--offset|#,#\" in Squares');
            } else if (data.offsetX > 50*70 || data.offsetY > 50*70) {
                //In case the offset was entered in pixels
                retVal.push('Offset out of range. Format is \"--offset|#,#\" in Squares (Max 50)');
            }
            
            //size must be "#,#""
            if (isNaN(data.sizeX) || isNaN(data.sizeY) || data.sizeX === null || data.sizeY === null) {
                retVal.push('Non-numeric size detected. Format is \"--size|#,#\"');
            }
            
            //light must be "#,#""
            if (isNaN(data.lightRad) || isNaN(data.lightDim) || data.lightRad === null || data.lightDim === null) {
                retVal.push('Non-numeric light radius detected. Format is \"--size|#,#\" \(bright, dim\)');
            }
            
            //Numeric qty between 1 and 20 required
            if (isNaN(data.qty)) {
                retVal.push('Non-numeric qty detected. Format is \"--qty|#\"');
            } /* else if ( data.qty <  1 || data.qty > 20 ) {
                retVal.push('Input qty out of range. Must be between 1 and 20.');
            }
            */
            
            //Check for supported FX
            if (data.fx !== '') {
                let fx = data.fx.split('-');
                if (fx.length !== 2) {
                    retVal.push('Invalid FX format. Format is --fx|type-color');
                } else if (fxModes.indexOf(fx[0]) === -1 ) {
                    retVal.push('Invalid FX type requested. Supported types are ' + fxModes.join(','));
                } else if (fxColors.indexOf(fx[1]) === -1 ) {
                    retVal.push('Invalid FX color requested. Supported colors are ' + fxColors.join(','));
                }
            }

            //check token expansion animation parameters
            if (data.expandIterations !== 0) {
                if (isNaN(data.expandIterations)) {
                    retVal.push('Non-numeric animation iterations detected. Format is \"--expand|#,#\" \(iterations, delay\)');
                }
                if (isNaN(data.expandDelay)) {
                    retVal.push('Non-numeric animation delay detected. Format is \"--expand|#,#\" \(iterations, delay\)');
                }
            }
            
            //check rotation input
            if (!isNumber(data.angle)) {
                if(!_.contains(['random','rand'], data.angle.toLowerCase())) {
                    retVal.push('Invalid rotation detected. Format is \"--rotation|# or rand/random\"');
                } else {
                    data.angle = randomInteger(360)-1;  //0 to 359deg
                }
            } else {    //normalize to account for excess degrees
                data.angle %= 360
            }
            
            //check layer input
            if (data.userSpecifiedLayer) {
                if ( data.spawnLayer.match(/obj/i) || data.spawnLayer.match(/tok/i) ) {
                    data.spawnLayer = 'objects';
                } else if ( data.spawnLayer.match(/gm/i) ) {
                    data.spawnLayer = 'gmlayer';
                } else if ( data.spawnLayer.match(/map/i) ) {
                    data.spawnLayer = 'map';
                } else {
                    retVal.push('Invalid layer requested. Valid layers are \"object(s)\", \"token\", \"tok\", \"gm\",\"map\"');
                }
            }
            
            
            //2nd data validation checkpoint. Potentially return several error msgs
            if (retVal.length > 0) {return retVal};
            
            //////////////////////////////////////////////////////////////////////
            //  Input parameters are Valid. Continue with the collected parameters
            //////////////////////////////////////////////////////////////////////
            
            //The spawn location is determined relative to spawn origin token. Default is selected token. Optionally was passed as arg by user via "--targets"
            //  Get token objects for "selected" and "targets"
            if (data.originIDs.length === 0) {
                //  Origin(s) = selected token(s) --default condition
                data.selectedIDs.forEach(id => {
                    data.selectedToks.push(getObj("graphic",id));
                    data.originToks.push(getObj("graphic",id));
                });
            } else {
                //  Origin(s) are targets, separate from selected tokens
                data.selectedIDs.forEach(id => data.selectedToks.push(getObj("graphic",id)));
                data.originIDs.forEach(id => data.originToks.push(getObj("graphic",id)));
            }
            
            //get the page grid settings
            data.spawnPageID = data.originToks[0].get("pageid");
            if (data.spawnPageID) {
                let page = getObj("page", data.spawnPageID);
                if (page) {
                    pageGridIncrement = page.get("snapping_increment");
                    gridSize = 70 * pageGridIncrement;
                } else {
                    sendChat('SpawnAPI',`/w "${data.who}" `+ 'Error: Unable to find pageGridIncrement for current page. Default 70px will be used');
                }
            } else {
                 return 'Error: Unable to find SpawnPageID for origin token';
            }
            
            //convert user input to pixels using current gridSize
            data.offsetX = data.offsetX * gridSize;
            data.offsetY = data.offsetY * gridSize;
            data.sizeX = data.sizeX * gridSize;
            data.sizeY = data.sizeY * gridSize;
            if (data.resizeSourceX !== -999) { data.resizeSourceX = data.resizeSourceX * gridSize }
            if (data.resizeSourceY !== -999) { data.resizeSourceY = data.resizeSourceY * gridSize }
            
            if (data.resizeTargetX !== -999) { data.resizeTargetX = data.resizeTargetX * gridSize }
            if (data.resizeTargetY !== -999) { data.resizeTargetY = data.resizeTargetY * gridSize }
            
            
            //For spawn tokens larger than 1x1, we need to apply a correction to the spawn position 
                    //otherwise inputting an offset could still spawn on top of the origin token 
            let tokSizeCorrectX = [];
            let tokSizeCorrectY = [];
            
            data.originToks.forEach(tok => {
                let w = parseFloat(tok.get("width"));
                let h = parseFloat(tok.get("height"));
                
                data.originToksWidth.push(w);
                data.originToksHeight.push(h);
                
                //Handle all cases for the sign of offset X & Y
                //NOTE: special case if the origin token is an even number of squares and forceToSquare===true, we'd like it to spawn within a full square, not halfway between squares
                switch (true) {
                    case data.offsetX === 0 && data.offsetY === 0:  //X=0 && Y=0
                        tokSizeCorrectX.push(0);
                        tokSizeCorrectY.push(0);
                        if (data.forceToSquare) {
                            /*   */if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 === 0) {     //EVEN && EVEN
                                        tokSizeCorrectX[tokSizeCorrectX.length - 1] += gridSize/2;
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] += gridSize/2;
                            } else if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 !== 0) {     //EVEN && ODD
                                        tokSizeCorrectX[tokSizeCorrectX.length - 1] += gridSize/2;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 === 0) {     //ODD && EVEN
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] += gridSize/2;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 !== 0) {     //ODD && ODD
                                        //no additional correction
                            } 
                            break;
                        }
                    case data.offsetX === 0 && data.offsetY > 0:    //X=0 && Y POS
                        tokSizeCorrectX.push(0);
                        tokSizeCorrectY.push( (w-gridSize)/2 ); 
                        if (data.forceToSquare) {
                            /*   */if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 === 0) {     //EVEN && EVEN
                                        tokSizeCorrectX[tokSizeCorrectX.length - 1] += gridSize/2;
                            } else if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 !== 0) {     //EVEN && ODD
                                        tokSizeCorrectX[tokSizeCorrectX.length - 1] += gridSize/2;
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] -= gridSize/2;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 === 0) {     //ODD && EVEN
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] += gridSize/2;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 !== 0) {     //ODD && ODD
                                        //no additional correction
                            } 
                            break;
                        }
                    case data.offsetX === 0 && data.offsetY < 0:    //X=0 && Y NEG
                        tokSizeCorrectX.push(0);
                        tokSizeCorrectY.push( -(w-gridSize)/2 );
                        if (data.forceToSquare) {
                                /*   */if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 === 0) {     //EVEN && EVEN
                                        tokSizeCorrectX[tokSizeCorrectX.length - 1] += gridSize/2;
                            } else if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 !== 0) {     //EVEN && ODD
                                        tokSizeCorrectX[tokSizeCorrectX.length - 1] += gridSize/2;
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] += gridSize/2;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 === 0) {     //ODD && EVEN
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] -= gridSize/2;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 !== 0) {     //ODD && ODD
                                        //no additional correction
                            } 
                            break;
                        }
                    case data.offsetX > 0 && data.offsetY === 0:    //X POS && Y=0
                        tokSizeCorrectX.push( (w-gridSize)/2 ); 
                        tokSizeCorrectY.push(0);
                        if (data.forceToSquare) {
                                /*   */if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 === 0) {     //EVEN && EVEN
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] += gridSize/2;
                            } else if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 !== 0) {     //EVEN && ODD
                                        //tokSizeCorrectX[tokSizeCorrectX.length - 1] += 35;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 === 0) {     //ODD && EVEN
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] += gridSize/2;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 !== 0) {     //ODD && ODD
                                        //no additional correction
                            } 
                            break;
                        }
                    case data.offsetX < 0 && data.offsetY === 0:    //X NEG && Y=0
                        tokSizeCorrectX.push( -(w-gridSize)/2 ); 
                        tokSizeCorrectY.push(0); 
                        if (data.forceToSquare) {
                                /*   */if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 === 0) {     //EVEN && EVEN
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] += gridSize/2;
                            } else if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 !== 0) {     //EVEN && ODD
                                        //tokSizeCorrectX[tokSizeCorrectX.length - 1] += 35;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 === 0) {     //ODD && EVEN
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] += gridSize/2;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 !== 0) {     //ODD && ODD
                                        //no additional correction
                            } 
                            break;
                        }
                    case data.offsetX > 0 && data.offsetY > 0:    //X POS && Y POS
                        tokSizeCorrectX.push( (w-gridSize)/2 ); 
                        tokSizeCorrectY.push( (w-gridSize)/2 );
                        if (data.forceToSquare) {
                                /*   */if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 === 0) {     //EVEN && EVEN
                                        //no additional correction
                            } else if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 !== 0) {     //EVEN && ODD
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] -= gridSize/2;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 === 0) {     //ODD && EVEN
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] += gridSize/2;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 !== 0) {     //ODD && ODD
                                        //no additional correction
                            } 
                            break;
                        }
                    case data.offsetX > 0 && data.offsetY < 0:    //X POS && Y NEG
                        tokSizeCorrectX.push( (w-gridSize)/2 ); 
                        tokSizeCorrectY.push( -(w-gridSize)/2 );
                        if (data.forceToSquare) {
                                /*   */if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 === 0) {     //EVEN && EVEN
                                        //no additional correction
                            } else if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 !== 0) {     //EVEN && ODD
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] += gridSize/2;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 === 0) {     //ODD && EVEN
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] -= gridSize/2;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 !== 0) {     //ODD && ODD
                                        //no additional correction
                            } 
                            break;
                        }
                    case data.offsetX < 0 && data.offsetY > 0:    //X NEG && Y POS
                        tokSizeCorrectX.push( -(w-gridSize)/2 ); 
                        tokSizeCorrectY.push( (w-gridSize)/2 ); 
                        if (data.forceToSquare) {
                                /*   */if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 === 0) {     //EVEN && EVEN
                                        //no additional correction
                            } else if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 !== 0) {     //EVEN && ODD
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] -= gridSize/2;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 === 0) {     //ODD && EVEN
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] += gridSize/2;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 !== 0) {     //ODD && ODD
                                        //no additional correction
                            } 
                            break;
                        }
                    case data.offsetX < 0 && data.offsetY < 0:    //X NEG && Y NEG
                        tokSizeCorrectX.push( -(w-gridSize)/2 ); 
                        tokSizeCorrectY.push( -(w-gridSize)/2 );
                        if (data.forceToSquare) {
                                /*   */if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 === 0) {     //EVEN && EVEN
                                        //no additional correction
                            } else if ( (w/gridSize)%2 === 0 && (h/gridSize)%2 !== 0) {     //EVEN && ODD
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] += gridSize/2;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 === 0) {     //ODD && EVEN
                                        tokSizeCorrectY[tokSizeCorrectY.length - 1] -= gridSize/2;
                            } else if ( (w/gridSize)%2 !== 0 && (h/gridSize)%2 !== 0) {     //ODD && ODD
                                        //no additional correction
                            } 
                            break;    
                        }
                }
            }); //end of data.originToks.forEach block (spawn placement corrections based on origin token size)
            
             
            ///////////////////////////////////////////////////////////////
            //  Spawn Placement  -- calculate all coordinates
            ///////////////////////////////////////////////////////////////
            
            //All tokens spawn on the same page and layer as the origin token(s) unless specified by user command
            //data.spawnPageID = data.originToks[0].get("pageid");      //this line moved up so we can get the page grid settings 
            if (data.userSpecifiedLayer===false) {
                data.spawnLayer = data.originToks[0].get("layer");
            } 
            
            
            let left;
            let top;
            let width;
            let height;
            //Calculate spawn coords
            switch (data.placement) {   //If user gave no "placement" command, default to "stack" tokens on top of each other
                //there will be (qty*num_OriginToks) coordinate pairs
                case "row":
                    for (o = 0; o < data.originToks.length; o++) {
                        left = data.originToks[o].get("left");
                        top = data.originToks[o].get("top");
                        for (q = 0; q < data.qty; q++) {
                            data.spawnX.push(left + data.offsetX  + tokSizeCorrectX[o] + q*gridSize);   
                            data.spawnY.push(top + data.offsetY  + tokSizeCorrectY[o]);
                        }
                    }
                    break;
                case "col":
                case "column":
                    for (o = 0; o < data.originToks.length; o++) {
                        left = data.originToks[o].get("left");
                        top = data.originToks[o].get("top");
                        for (q = 0; q < data.qty; q++) {
                            data.spawnX.push(left + data.offsetX + tokSizeCorrectX[o]);   
                            data.spawnY.push(top + data.offsetY  + tokSizeCorrectY[o] + q*gridSize);
                        }
                    }
                    break;
                case "surround":
                    //NOTE: This case ignores offset. Starts above the token and spirals clockwise
                    for (o = 0; o < data.originToks.length; o++) {
                        let surroundingSquares = GetSurroundingSquaresArr(data.qty, data.originToks[o]);
                        for (q = 0; q < data.qty; q++) {
                            data.spawnX.push(surroundingSquares[q].x);   
                            data.spawnY.push(surroundingSquares[q].y);
                        }
                    }
                    break;
                case "grid":   //arrange in a square grid 
                    for (o = 0; o < data.originToks.length; o++) {
                        left = data.originToks[o].get("left") + data.offsetX + tokSizeCorrectX[o];
                        top = data.originToks[o].get("top") + data.offsetY + tokSizeCorrectY[o];
                        
                        let gridSquares = GetGridArr(data.qty, left, top, data.gridCols);
                        for (q = 0; q < data.qty; q++) {
                            data.spawnX.push(gridSquares[q].x);   
                            data.spawnY.push(gridSquares[q].y);
                        }
                    }
                    break; 
                case "burst":   //arrange in an expanding burst from corners 
                    for (o = 0; o < data.originToks.length; o++) {
                        let burstSquares = GetBurstArr(data.qty, data.originToks[o], data.burstRad, data.offsetX, data.offsetY);
                        for (q = 0; q < data.qty; q++) {
                            data.spawnX.push(burstSquares[q].x);   
                            data.spawnY.push(burstSquares[q].y);
                        }
                    }
                    break;   
                case "cross":   //arrange in an expanding cross pattern vertically & horizontally 
                    for (o = 0; o < data.originToks.length; o++) {
                        left = data.originToks[o].get("left") + data.offsetX + tokSizeCorrectX[o];
                        top = data.originToks[o].get("top") + data.offsetY + tokSizeCorrectY[o];
                        width = parseFloat(data.originToks[o].get("width"));
                        height = parseFloat(data.originToks[o].get("height"))
                        
                        let crossSquares = GetCrossArr(data.qty, left, top, width, height, data.crossRad, data.forceToSquare);
                        for (q = 0; q < data.qty; q++) {
                            data.spawnX.push(crossSquares[q].x);   
                            data.spawnY.push(crossSquares[q].y);
                        }
                    }
                    break;
                case "random":   //arrange in random spaces within a square grid 
                    for (o = 0; o < data.originToks.length; o++) {
                        left = data.originToks[o].get("left") + data.offsetX + tokSizeCorrectX[o];
                        top = data.originToks[o].get("top") + data.offsetY + tokSizeCorrectY[o];
                        
                        let randSquares = GetRandArr(data.qty, left, top, data.gridCols);
                        for (q = 0; q < data.qty; q++) {
                            data.spawnX.push(randSquares[q].x);   
                            data.spawnY.push(randSquares[q].y);
                        }
                    }
                    break; 
                case "stack":   //The default case is "stack"
                default:    
                    for (o = 0; o < data.originToks.length; o++) {
                        left = data.originToks[o].get("left");
                        top = data.originToks[o].get("top");
                        for (q = 0; q < data.qty; q++) {
                            data.spawnX.push(left + data.offsetX + tokSizeCorrectX[o]);
                            data.spawnY.push(top + data.offsetY + tokSizeCorrectY[o]);
                        }
                    }
                    break;    
            }
            
            //Get page lighting mode (UDL vs LDL)
            var page = findObjs({                              
              _id: data.spawnPageID,                        
            });
            data.UDL = page[0].get("dynamic_lighting_enabled");
            let spawnX_max = parseInt(page[0].get("width")) * 70/pageGridIncrement;
            let spawnY_max = parseInt(page[0].get("height")) * 70/pageGridIncrement;
            
            //grab the character object to spawn from supplied spawnName
            let spawnObj = getCharacterFromName(data.spawnName);
            let validObj = validateObject(data.who, spawnObj, 'character', data.spawnName);
            if (!(validObj === 'true')) {
                retVal.push(validObj);
                return retVal;
            }
            
            //potentially update the controlledby property of the character sheet to be spawned
            if (charControlledBy.length > 0) {
                let cbList = '';
                let tempArr = [];
                if (appendControlledBy) {
                    let currentControlledBy = spawnObj.get('controlledby');
                    if (currentControlledBy === '') {
                        cbList = charControlledBy.join(',');
                    } else {
                        charControlledBy.forEach(pid => {
                            if (currentControlledBy.includes(pid)===false) {
                                tempArr.push(pid);
                            }
                        });
                        if (tempArr.length > 0) {
                            cbList = currentControlledBy + ',' + tempArr.join(',');
                        } else {
                            cbList = currentControlledBy;
                        }
                    }
                } else {
                    cbList = charControlledBy.join(',');
                }
                spawnObj.set('controlledby', cbList);
            }
            
            ///////////////////////////////////////////////////////////////////////////////////
            //  Start spawning!         --spawns (q=qty) tokens at each of (o=origin) locations
            ///////////////////////////////////////////////////////////////////////////////////
            //get defaulttoken for SpawnObj, then start spawning with the assembled options 
            //  NOTE: this runs asynchronously, so calling the spawn function from within callback
                spawnObj.get("_defaulttoken", function(defaultToken) {
                    let iteration = 0
                    for (o = 0; o < data.originToks.length; o++) {
                        for (q = 0; q < data.qty; q++) {
                            //Make sure we don't try to spawn off the map
                            if (data.spawnX[iteration] > 0 && data.spawnX[iteration] < spawnX_max & data.spawnY[iteration] > 0 && data.spawnY[iteration] < spawnY_max) {
                                //trigger special FX?
                                if (data.fx !== ''){
                                    spawnFx(data.spawnX[iteration], data.spawnY[iteration], data.fx, data.spawnPageID);
                                }
                                //Spawn the token!
                                spawnTokenAtXY(data.who, defaultToken, data.spawnPageID, data.spawnLayer, data.spawnX[iteration], data.spawnY[iteration], data.currentSide, data.sizeX, data.sizeY, data.zOrder, data.lightRad, data.lightDim, data.mook, data.UDL, data.bar1Val, data.bar1Max, data.bar1Link, data.bar2Val, data.bar2Max, data.bar2Link, data.bar3Val, data.bar3Max, data.bar3Link, data.expandIterations, data.expandDelay, data.destroySpawnWhenDone, data.angle, data.isDrawing, data.tokenName, data.tooltip, data.tokenPropValPairs);
                                
                            } else {
                                log("off the map!");
                            }
                            iteration += 1;
                        }    
                    }
                });
            
            //Optional resize source token
            if (data.resizeSourceX !== -999 && data.resizeSourceY !== -999) {
                data.selectedToks.forEach(tok => {
                    resizeToken(tok, data.resizeSourceIterations, data.resizeSourceDelay, tok.get("width"), tok.get("height"), data.resizeSourceX, data.resizeSourceY, data.destroySpawnWhenDone)
                });
            }
            //Optional resize target token
            if (data.resizeTargetX !== -999 && data.resizeTargetY !== -999) {
                data.originToks.forEach(tok => {
                    resizeToken(tok, data.resizeTargetIterations, data.resizeTargetDelay, tok.get("width"), tok.get("height"), data.resizeTargetX, data.resizeTargetY, data.destroySpawnWhenDone)
                });
            }
            
            //Optional delete source token
            if (data.deleteSource === true) {
                data.selectedToks.forEach(tok => {
                    tok.remove();
                });
            }
            //Optional delete target token
            if (data.deleteTarget === true) {
                data.originToks.forEach(tok => {
                    tok.remove();
                });
            }
            
            
            /////////////////////////////////////////////////////////////////////////////////
            //Optional automatic trigger of a supplied ability "macro" when spawn is complete
            //      Default sheet is from the selected token, 
            //      ...but allow looking from another character sheet if supplied (e.g. "macro mule") via --sheet|charName
            /////////////////////////////////////////////////////////////////////////////////
            
            validObj = 'false';
            if (data.abilityName !== "") {  //user wants to trigger an ability after spawn
                if (data.sheetName === "") {
                    //Look for the ability on the first selected token. Get character sheet first.
                    var sheetCharObj = getCharacterFromToken(data.selectedToks[0]);  
                        validObj = validateObject(data.who, sheetCharObj, 'character', data.selectedToks[0].get("name"));
                } else {
                    //User sepecified ability is found on a sheet other than the first selected token. Get character sheet first.
                    var sheetCharObj = getCharacterFromName(data.sheetName);
                        validObj = validateObject(data.who, sheetCharObj, 'character', data.sheetName);
                }
                if (!(validObj === 'true')) {
                    retVal.push(validObj);
                    return retVal
                }
                
                //Get the characterID to find the ability 
                let sheetCharID = sheetCharObj.get("id");
                
                //now actually look for the ability and call it with sendChat
                validObj = 'false';
                let abilityObj = getAbilityFromName(sheetCharID, data.abilityName);
                    validObj = validateObject(data.who, abilityObj, 'ability', data.abilityName);
                    if (!(validObj === 'true')) {
                        retVal.push(validObj);
                        return retVal
                    }
                 
                let action = abilityObj.get("action");
                //log(action);
                sendChat(data.who, action);
            }
        
            return retVal;
        
        } catch(err) {
            sendChat('SpawnAPI',`/w "${data.who}" `+ 'Unhandled exception: ' + err.message);
        }
    };
    
    const parseArgs = function(msg) {
        msg.content = msg.content
            .replace(/<br\/>\n/g, ' ')
            .replace(/(\{\{(.*?)\}\})/g," $2 ")
        
        //Check for inline rolls for spawn qty e.g. [[1d4]] or [[ 1t[tableName] ]]
        inlineContent = processInlinerolls(msg);
        
        let args = inlineContent.split(/\s+--/).map(arg=>{
                let cmds = arg.split('|');
                return {
                    cmd: cmds.shift().toLowerCase().trim(),
                    params: cmds[0]
                };
            });
        return args;
    };
    
    ////////////////////////////////////////////////////////////////////////////////////////
    //          PRIMARY MESSAGE HANDLER
    ////////////////////////////////////////////////////////////////////////////////////////
    const handleInput = function(msg) {
        try {
            if(msg.type=="api" && msg.content.indexOf("!Spawn") === 0 ) {
                whoDat = getObj('player',msg.playerid).get('_displayname');
                //only a valid call if token(s) have been selected, or if the api was called from the script-generated chat button using the "memento" registry
                if (msg.selected === undefined && msg.content.indexOf("memento") === -1 ) {
                    sendChat('SpawnAPI',`/w "${whoDat}" `+ 'You must select a token to proceed');
                    return;
                }
                
                ////////////////////////////////////////////////////////////////////////////////////////
                //  Container for all of the possible relevant parameters, with defaults when available
                ////////////////////////////////////////////////////////////////////////////////////////
                    // data object hoisted for use in functions above
                var data = {
                    who: whoDat,        //Who called the script
                    spawnName: "",      //name of the target to spawn
                    validArgs: "name, qty, targets, placement, force, offset, sheet, ability, side, size, order, light, mook, fx, bar1, bar2, bar3, expand, deleteSource, deleteTarget, resizeSource, resizeTarget, rotation, layer",    //list of valid user commands for error message
                    qty: 1,             //how many tokens to spawn at each origin
                    //tokenIDs and objects
                    originToks: [],     //array of token objects to be used as reference point(s) for spawn location(s). 
                                            //---(Default will be the selected token, but --numTargets is an optional argument that will spawn from target token(s))
                    originIDs: [],      //array of originIDs
                    originToksWidth: [], //used for cases where token is larger size. Will shift spawn location to perimeter
                    originToksHeight: [], //used for cases where token is larger size. Will shift spawn location to perimeter
                    selectedToks: [],   //array of the selected tokens
                    selectedIDs: [],    //the selected tokenID(s)
                    
                    //Where the token will spawn -> (pageID, left, top)
                        //---Defaults to selected token unless supplied by user with @{target|...}
                        //---May be additionally modified by offset(X,Y)
                    spawnPageID: "",     //what page to spawn.
                    spawnX: [],         //spawn coordinates. Array to handle multiple spawns
                    spawnY: [],         //spawn coordinates. Array to handle multiple spawns
                    offsetX: 0,         //offset from origin token. (Note: offset is input in SQUARES and converted to pixels)
                    offsetY: 0,
                    forceToSquare: false,    //Forces spawn to occur in a full square. If false && origin token is even number of squares, may spawn between squares depending on offset conditions
                    validPlacements: "stack, row, col/column, surround, grid, burst, cross",    //list of valid placement arguments for error message
                    placement: "stack", //how to place multiple tokens:
                                            //'stack'       = tokens stacked on top of each other
                                            //'row'         = horizontal row of tokens
                                            //'column/col'  = vertical column of tokens
                                            //'surround'    = clockwise spiral placement around origin  (ignores offset)
                                            //'grid #'      = square grid with # cols. Raster left to right
                                            //'burst #'     = "evenly" distributed diagonal qty, starting at corners and away from origin by #
                                            //'cross #'     = "evenly" distributed vert/horiz qty, starting directly above origin by # squares
                    burstRad: 0,        //how far away from origin the burst placement starts
                    crossRad: 0,        //how far away from origin the cross placement starts
                    gridCols: 3,        //Only used for grid placement. number of tokens per row 
                                            
                    //Spawned token properties
                    currentSide: -999,  //sets the side of a rollable table token
                    sizeX: 1,          //sets the size of token (will be converted to pixels based on pege grid size)
                    sizeY: 1,              //--Defaults to 1x1 square. (NOTE: user inputs in squares and gets converted to pixels)
                    zOrder: "toFront",  //Default z-order
                    lightRad: -999,     //Optional change the emitted light characteristics --> light_radius
                    lightDim: -999,     //Optional change the emitted light characteristics --> light_dimradius
                    mook: false,        //Will the token use "represents"? If true, will change linked attributes for all associated tokens (e.g. hp)
                    bar1Val: "",        //bar1 overridevalue 
                    bar1Max: "",        //bar1_max overridevalue
                    bar1Link: false,    //Do we retain the bar1 attribute link?
                    bar2Val: "",        //bar2 overridevalue 
                    bar2Max: "",        //bar2_max overridevalue
                    bar2Link: false,    //Do we retain the bar2 attribute link?
                    bar3Val: "",        //bar3 overridevalue 
                    bar3Max: "",        //bar3_max overridevalue
                    bar3Link: false,    //Do we retain the bar3 attribute link?
                    UDL: false,         //Does the page use UDL?
                    sheetName: "",          //the char sheet in which to look for the supplied ability, defaults to the sheet tied to the first selected token 
                    abilityName: "",        //an ability to trigger after spawning
                    fx: "",                  //fx to trigger at the origin point(s)
                    expandIterations: 0,    //how many animation frames to use if animated token expansion is called for
                    expandDelay: 50,         //delay (in ms) between each frame if animated expansion is called for
                    deleteSource: false,    //deletes the source token upon spawning new token
                    deleteTarget: false,    //deletes the target token upon spawning new token
                    resizeSourceX: -999,    //resizes the source token upon spawning new token
                    resizeSourceY: -999,    //resizes the source token upon spawning new token
                    resizeTargetX: -999,    //resizes the target token upon spawning new token
                    resizeTargetY: -999,    //resizes the target token upon spawning new token
                    resizeSourceIterations: 20,    //how many animation frames to use if animated source token resize is called for
                    resizeSourceDelay: 50,         //delay (in ms) between each frame if animated source resize is called for
                    resizeTargetIterations: 20,    //how many animation frames to use if animated target token resize is called for
                    resizeTargetDelay: 50,         //delay (in ms) between each frame if animated target resize is called for
                    destroySpawnWhenDone: false,   //delete the spawned token after animation is complete    
                    angle: 0,                      //change the rotation of the spawned token
                    userSpecifiedLayer: false,     //flag to determine how spawned token layer is defined
                    spawnLayer: "objects",         //user can set to "object", "token", "gm", or "map"
                    isDrawing: false,              //user can set isdrawing property of token 
                    tokenName: "",                 //optional override for the token name - allows token name to be different than the character name 
                    tooltip: "",                   //new tooltip token property   
                    tokenPropValPairs: ""          //array of tokenProp:value pairs
                };
                
                //Parse msg into an array of argument objects [{cmd:params}]
                        //using helper function because we may have to do it a second time on oldMsg for the --targets case
                let args = parseArgs(msg);
                
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //  Due to a bug in the API, if a @{target|...} is supplied, the API does not acknowledge msg.selected anymore.
                //      See notes at the top of the script
                //      This code block handles this "targets" case by creating a chat button to enable both selected(s) and target(s) 
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                
                //First, see if there was a --targets argument
                let targ = args.find(c=>'targets' === c.cmd);
                if (targ) { // USER REQUESTING TARGETS CASE
                    // if --targets was specified, find the number of targets to get and whisper a button to the caller
                    let mid = store(msg);
                    let num = parseInt(targ.params)||1;
                    sendChat('',`/w "${data.who}" [Select Targets](!Spawn --memento|${mid} --targs|${range(num).map(n=>`&commat;{target|Pick ${n}|token_id}`).join(',')})`);
                    
                } else {    // NO "--TARGETS" IN MESSAGE -- could be an original call or a call from the api-generated chat button
                    
                    //CHECK FOR "OLD" MESSAGE -- occurs when user previously requested targets and has clicked the chat button
                    // see if this is a button call back for getting targets
                    let marg = args.find(c=>'memento' === c.cmd);
                    if (marg) {  // TARGETS REQUESTED CASE
                        let oldMsg = retrieve(parseInt(marg.params));
                        
                        // found the old message
                        if(oldMsg){
                            //get list of targets
                            let tsarg = args.find(c=>'targs' === c.cmd);
                            let targets = tsarg["params"].split(",");
                            
                            //reassign args using  the original message
                            args = parseArgs(oldMsg);
                            //assign targetIDs to data object (extracted from chat button message)
                            targets.forEach((targ) => {
                                data.originIDs.push(targ);
                            });
                            
                            //assign selectedIDs to params (extracted from old message)
                            oldMsg.selected.forEach((sel) => {
                                data.selectedIDs.push(sel["_id"]);
                            });
                        } 
                    } else {  // NO OLD MESSAGE -- this is a singular api call, using only "selected" token (no targets)  
                        //assign selectedIDs to data object directly from the one (and only) call to the script
                        msg.selected.forEach((sel) => {
                            data.selectedIDs.push(sel["_id"]);
                        });
                    }
                    
                    ///////////////////////////////////////////////////////////////////////////////////////////////////
                    //Ok, now that we've handled all the selected/target unpleasantness, we're ready to start spawning!
                    ///////////////////////////////////////////////////////////////////////////////////////////////////
                    let errorMsg = processCommands(data, args) || [];
                    if (errorMsg.length > 0) {
                        //Spam the chat with one or more errors (could be multiple due to user input validation checks)
                        errorMsg.forEach((errMsg) => {
                            sendChat('SpawnAPI',`/w "${data.who}" `+ errMsg);
                        });
                        return;
                    } 
                    
                }
            }
        }
        catch(err) {
          sendChat('SpawnAPI',`/w "${data.who}" `+ 'Unhandled exception: ' + err.message);
        }
    };
    
    const registerEventHandlers = function() {
        on('chat:message', handleInput);
    };

    on("ready",() => {
        checkInstall();
        registerEventHandlers();
    });
})();
