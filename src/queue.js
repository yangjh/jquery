(function( jQuery ) {

jQuery.extend({
    ///we should only queue data as function,
    ///because the dequeue treat data as function
    ///if we queue data as plain object, dequeue will throw bug
	queue: function( elem, type, data ) {
		if ( !elem ) {
			return;
		}

        ///default type of queue is fx
		type = (type || "fx") + "queue";
		var q = jQuery.data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a lookup
		if ( !data ) {
			return q || [];
		}

		if ( !q || jQuery.isArray(data) ) {
			q = jQuery.data( elem, type, jQuery.makeArray(data) );

		} else {
			q.push( data );
		}

		return q;
	},

    ///dequeue not only dequeue current item and call it,
    ///but it will also change the function, so that it will
    ///call dequeue another item, after the function finished
    //so the function is normally like,
    ///function (next) {
    /// do something
    /// next();
    ///}
	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress sentinel
        /// if fn is not a function, we should get next one
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}
	}
});

jQuery.fn.extend({
    ///queue fx, will also dequeue automatically after
    //so you don't need to dequeue explicitly
	queue: function( type, data ) {
        ///if you queue(function () {});
        ///which means queue("fx", function (){});
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function( i ) {
            ///first queue the data
			var queue = jQuery.queue( this, type, data );

            ///optionally, dequeue the data, if the function just queue
            ///is not "inprogress"
			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},

	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
        ///jQuery.fx.spped[time] is defined, then use it
        ///otherwise time, so you can write delay("slow") or delay(1000);
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},

	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	}
});

})( jQuery );
