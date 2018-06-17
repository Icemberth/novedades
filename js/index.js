'use strict';
				
//;( function ( document, window, index )
//{   
	// feature detection for drag&drop upload
	var isAdvancedUpload = function() {
		var div = document.createElement( 'div' );
		return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FormData' in window && 'FileReader' in window;
	}();
    
		// applying the effect for every form
		let forms = $('.box');		
		$(forms).each((index, form) => {						
			let label		 = form.querySelector( 'label' ),
			droppedFiles = false,		
			showFiles	 = function( files ) {
					label.textContent = files.length > 1 ? ( $(input).attr( 'data-multiple-caption' ) || '' ).replace( '{count}', files.length ) : files[ 0 ].name;
			},
			triggerFormSubmit = function(droppedFiles) {
				var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            //var wb = XLSX.read(data, {type: 'binary'});
            var arr = String.fromCharCode.apply(null, new Uint8Array(data));
            var wb = XLSX.read(btoa(arr), {type: 'base64'});
            console.log(process_wb(wb));
        };
        reader.readAsArrayBuffer(droppedFiles[0]);
			};			
			 // drag&drop files if the feature is available
			 if( isAdvancedUpload )
			 {
					 form.classList.add( 'has-advanced-upload' ); // letting the CSS part to know drag&drop is supported by the browser

					 [ 'drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop' ].forEach( function( event )
					 {
							 form.addEventListener( event, function( e )
							 {
									 // preventing the unwanted behaviours
									 e.preventDefault();
									 e.stopPropagation();
							 });
					 });
					 [ 'dragover', 'dragenter' ].forEach( function( event )
					 {
							 form.addEventListener( event, function()
							 {
									 form.classList.add( 'is-dragover' );
							 });
					 });
					 [ 'dragleave', 'dragend', 'drop' ].forEach( function( event )
					 {
							 form.addEventListener( event, function()
							 {
									 form.classList.remove( 'is-dragover' );
							 });
					 });
					 form.addEventListener( 'drop', function( e )
					 {
							 droppedFiles = e.dataTransfer.files; // the files that were dropped
							 showFiles( droppedFiles );
							 triggerFormSubmit(droppedFiles);
					 });
			 }
		});	
  

       /* // restart the form if has a state of error/success
        Array.prototype.forEach.call( restart, function( entry )
        {
            entry.addEventListener( 'click', function( e )
            {
                e.preventDefault();
                form.classList.remove( 'is-error', 'is-success' );
                input.click();
            });
        });*/

        // Firefox focus bug fix for file input
        //input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
        //input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
