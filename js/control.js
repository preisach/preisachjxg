// #!/BIN....js
/**
 * 
 * @author marcd 2019-03-01
 */

/*
 *	UI should in show
 * 	1a.	number on line
 *	1b.	a number vs the same number on plane (diagonal)
 *	3a.	2 distinct numbers on a line
 *	3b.	n1 vs n2 on plane
 *	5a.	a swith on IO
 *	5b.	a switch on II (box and dot on diagonal)
 *	7a.	a thermostat on IO
 *	7b	a thermostat on II
 *	*	would love to see an II plane with arbitrary click to add hysteron and auto-plot complete IO
 *	9a.	multistat IO
 *	9b.	multistat II
 */

require( ["js/lib/preisach", "js/lib/preisach_utils", "js/boards", "js/jxgParams", "js/jxgVars"],
	function(p, pu, b, pars, vars) { 
		var INITIAL_SATURATION = 1;
		var supportSize;
			// input, 
			// output;

		var discretePreisach;

		var jxbIO, 
			jxbInput, 
			jxbII;

		var jxgSlider_supportSize;

		var jxgIOCurves = [];
		var jxgHysterons = [];	// var jxgIIPoly;

		var jxgIOPoint,
			jxgInputPoint,
			jxgIIPoint;
		
		this.supportSize = 5;
		// this.input = 1;
		// this.output = 1; // f_on(1);

		initView();		
		// initModel
		// refreshView
		supportUpdated(this.supportSize);		

		var button1 = this.jxbII.create('button', [0.2, 0.8, '<div class=faGearIcon></div>']);

		/**
		 * @param 
		 */
		function supportUpdated(x) {
			// console.log("supportUpdated\nsize = ", x);

			if (typeof(this.discretePreisach) == 'undefined' || this.discretePreisach.weights[0].length != x) {
				this.discretePreisach = 
					initModel(preisach, x, INITIAL_SATURATION, INITIAL_SATURATION, INITIAL_SATURATION);
			}
			inputUpdated(INITIAL_SATURATION);
			
			refreshView();
		}

		/**
		 * @param 
		 */
		function initModel(preisach, n, input, output, saturation) {
			// console.log("preisach = ", preisach);
			let thresholds = preisach.initThresholds(0, 1, n);
			// let thermostats = preisach.initThermostatsNL(thresholds, f_off, f_on);
			let weights = new preisach.initWeights(thresholds, 'uniform');
			let states = new preisach.initStates(thresholds, 'saturated', 1);
			let thermostats = preisach.initThermostats(thresholds, input, states);
			let d = new preisach.discrete(thresholds, thermostats, weights, input, output);
			return d;
		}
		
		/**
		 * @param 
		 */
		function initView() {
			[this.jxbIO, this.jxbInput, this.jxbII] = boards.createBoards(); 
			this.jxgSlider_supportSize 	= boards.initSupportSlider(this.jxbII, this.supportSize);

			[this.jxgIOPoint, this.jxgInputPoint, this.jxgIIPoint] = 
				jxgVars.createPoints([this.jxbIO, this.jxbInput, this.jxbII]);

			this.jxgInputPoint.on('drag', function() { inputUpdated(this.X()); });
			this.jxgIIPoint.on( 'drag',   function() { inputUpdated(this.X()); });
			this.jxgSlider_supportSize.on('drag', function() { supportUpdated(this.Value()); });		
		}

		/**
		 * @param 
		 */
		function refreshView() {
			this.jxgIOPoint.moveTo([1, 1]);
			this.jxgIOPoint.clearTrace();
			this.jxgInputPoint.moveTo([1, 0]);
			this.jxgIIPoint.moveTo([1, 1]);
			
			if (typeof(this.jxgIOCurves) != 'undefined' && this.jxgIOCurves.length > 0) {
				jxgParams.removeCurves(this.jxbIO, this.jxgIOCurves);
			}
			if (typeof(this.jxgHysterons) != 'undefined' && this.jxgHysterons.length > 0) {
				jxgParams.removeCurves(this.jxbII, this.jxgHysterons);
			}
			this.jxgIOCurves  = jxgParams.createCurves(this.jxbIO, preisach_utils.createAllCombos(this.discretePreisach));
			this.jxgHysterons = jxgParams.createHysterons(this.jxbII, this.discretePreisach);
		}

		/**
		 * @param 
		 */
		function inputUpdated(x) {
			// console.log('inputUpdated:...this = ', this);
			let inputs, outputs;

			// send update to model
			[inputs, outputs] = updateModel(x);

			// update view for every regulated model update
			for( let i = 0; i < inputs.length; i++ ) {		
				input = inputs[i];
				// output = outputs[i];
				updateView(input, outputs[i]);
			}
			// we should have a polygon for the preisach stairs
			// jxgIIPoly.push a corner :)
			// jxgIIPoly.vertices.pop
			// different for increasing and decreasing
			// should have extra regulating of input to account for these corners aswell???
		}

		/**
		 * @param 
		 */
		function updateModel(x) {
			return this.discretePreisach.update(x);
		}

		/**
		 * @param 
		 */
		function updateView(input, out) {
			qualityDown([this.jxbIO, this.jxbInput, this.jxbII]);
			// pt2.setAttribute({size:20});belongs to IO
			// this.input = input;
			// this.output = out;

			// jxgIOPoint updated as a function cause it is not draggable, 	
			this.jxgIOPoint.moveTo([input, out]);
			this.jxgInputPoint.moveTo([input, 0]);  //can't be defined as a function cause it is draggable
			this.jxgIIPoint.moveTo(   [input, input]); //can't be defined as a function cause it is draggable
			// outSlider.moveTo([0, output]);//can't be defined as a function cause it is draggable
			
			this.jxbIO.update();
			// this.jxbInput.update();
			qualityUp([this.jxbIO, this.jxbInput, this.jxbII]);
		}

		/**
		 * @param 
		 */
		function qualityDown(brds){	
			for (brd in brds) {
				brd.updateQuality = brd.BOARD_QUALITY_LOW; 
			}
		}

		/**
		 * @param 
		 */
		function qualityUp(brds){	
			for ( brd in brds ) {
				brd.updateQuality = brd.BOARD_QUALITY_HIGH; 
			}
		}
});

/*
 * f_on and f_off not used in classical preisach
 */
/*
function f_on(input) {
	// 1/(1+exp(-10*(x-0.5)))
	return 1/(1 + Math.exp(-10 * (input - 0.5)));
	// return 1;
}
*/
/*function f_off(input) {
	return 0;
};*/