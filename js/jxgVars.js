/**
 *
 * 	@author marcd 2019-05-22
 * 
 */

(function(exports) {
	function createPoints([brdIO, brdInput, brdII]) {
		var pointIO,
			pointInput,
			pointII;

		var inputGuide,
			IIGuide;

		// CREATE GUIDES
		inputGuide 	= brdInput.create('line', 
							[[0, 0], [1, 0]], 
							{
								fixed:true, 
								strokecolor: 'black', 
								highlightstrokecolor: 'black'
							});
		IIGuide 	= brdII.create('line',
							[[0, 0], [1, 1]], 
							{
								fixed: true, 
								strokecolor: 'grey', 
								highlightstrokecolor: 'lightgrey'
							});

		pointIO 	= brdIO.create('point',
			// [function () { return input; }, function () { return output; }],
			[1.0, 1.0],
			{
				name: '',
				face: 'o',
				size: 6,
				strokeWidth: 2,
				// color: 'blue', color is shortcut for both stroke and fill
				fillColor: 'blue',
				strokeColor: 'red',
				fixed: true,
				trace: true,
				traceAttributes: {size: 5, strokeWidth: 0, fillOpacity: 0.1}
			});
		pointInput 	= brdInput.create('glider',
			[ 1, 0,	inputGuide],
			{
				fixed: false, 
				size:6, 
				name:''
			});
		pointII 	= brdII.create('glider',
			[1, 1, IIGuide], 
			{
				fixed: false,
				size: 6,
				name: ''
			});

		// point.setAttribute();
		return [pointIO, pointInput, pointII];
	}

	exports.createPoints = createPoints;
})( typeof exports === 'undefined' ? this['jxgVars'] = {}: exports );

/*
	var out = r.update(this.X());
	//pointIO.setPositionDirectly(JXG.COORDS_BY_USER, [this.X(), out]);
	pointIO.moveTo([this.X(), out]);
	pointII.moveTo([this.X(), this.X()]);
*/

/*
	// jxgIIPoly is the staircase
	jxgIIPoly = jxgBoardII.create('polygon',
					[
						// [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
						[0, 0],
						[1, 1],
						[1, 0]
						// [Infinity, 1],
						// [Infinity, Number.NEGATIVE_INFINITY]
					]
		);

	var jxgIIHLine = jxgBoardII.create(
						// 'line',
						'segment',
						[[1, 1], [2, 1]]
		);
	var jxgIIVLine = jxgBoardII.create(
						// 'line',
						'segment',
						[[1, 1], [1, 0]]
		);

*/


// TODO
// make thresholds 
/*
	var threshold_higher_slide = jxbInput.create('line', 
			[[function(){return r.threshold_higher;}, 0], [function(){return r.threshold_higher;}, 1]],
			{color:'red', dash:true, strokeWidth:1}
		);
	var threshold_lower_slide = jxbInput.create('line', 
			[[function(){return r.threshold_lower;}, 1], [function(){return r.threshold_lower;}, 0]],
			{color:'blue', dash:true, strokeWidth:1}
		);
*/

