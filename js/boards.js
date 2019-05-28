/**
 * @author marcd 2019
 */

(function(exports) {

	/**
	 * @param
	 * @return
	 */
	function createBoards() {
		// console.log("BOARDS.CREATE...");
		var jxbIO = JXG.JSXGraph.initBoard(
				'jxg-InOut',
				{
					axis: true,
					axis: {
								withLabel: true, 
								label: {
									position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
									// offset: [-15, 12]   // (in pixels)
								},	// 'myLabel', 
								name: 'myName'
							},
					showNavigation: false,
					showCopyright: false,
					boundingbox: [-0.15, 1.15, 1.15, -0.15],
					zoom: {wheel: true, needshift: true, factorX: 1.5, factorY: 1},
					pan: {enabled: true, needshift: true},
					showReload: true,
					axesAlways: true
				}
			);
		jxbIO.defaultAxes.x.name = '<div style="margin-left:-3em; margin-top: -0.5em; font-size:1.25em">input</div>';
		jxbIO.defaultAxes.y.name = '<div style="margin-left:-0.5em; margin-top: 3em; font-size:1.25em; transform:rotate(-90.0deg)">output</div>';

		/**
		 *
		 */
		var jxbInput = JXG.JSXGraph.initBoard(
		    'jxg-In', {
					axis:true,  
					grid:false,
					showNavigation:false, showCopyright:false,	
					// boundingbox:[function(){return view[0];}, 0.15,
					             // function(){return view[1];}, -0.15], 
					boundingbox:[-0.15, 0.15, 1.15, -0.15],
					zoom:{wheel:false, factorX:1.5, factorY:1}, 
					pan:{enabled:false},
					axesAlways:true,
					// zoom:{wheel:true},
					// jxbInput.defaultAxes.y.point1.coords.usrCoords = [1, x, 0];
					// axis:{originx:0.5}
					// origin:{usrCoords:[1, 0.5, 0]}
		    });

		/**
		 *
		 */
		var bb_pp = [-0.15, 1.15, 1.15, -0.15]; // bounding box
		var jxbII = JXG.JSXGraph.initBoard(
				'jxg-PreisachPlane',
				{
					boundingbox: bb_pp,
					axis: {
						withLabel: true,
						label: {position:'rt',},
					},
					grid: false,
					showNavigation: false,
					showCopyright: false,
					zoom: { wheel: true, needshift: true, factorX: 1.5, factorY: 1.5 },
					pan: { enabled: true, needshift: true },
					axesAlways: true
					//		dependentBoards:['jxbIO', 'jxbInput', 'jxg-IO-v-time']
				}
			);
		jxbII.defaultAxes.x.name = '<div style="margin-left:-3em; margin-top: -0.5em; font-size:1.25em">input</div>';
		jxbII.defaultAxes.y.name = '<div style="margin-left:-0.5em; margin-top: 3em; font-size:1.25em; transform:rotate(-90.0deg)">input</div>';

		return [jxbIO, jxbInput, jxbII];
	}

	/**
	 * @param
	 * @return
	 */
	function initSupportSlider(brd, supportSize) {
		// console.log("creating slider\nboard = ", brd);
		// slider has an action associated with it!!!
		var slider = brd.create('slider', 
				[[0.2, 1.0], [0.6, 1], [1, supportSize, 10]], 
				{ 
					precision:0, snapWidth: 1, ticks: { drawLabels: false }
				});
		return slider;
	}
	
	exports.createBoards = createBoards;
	exports.initSupportSlider = initSupportSlider;
})( typeof exports === 'undefined' ? this['boards'] = {}: exports );
