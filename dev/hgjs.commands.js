/**

HackerGame

**/
(function ($, hg) {
	var toText = function (input) {
			var output = "";
			if (typeof input == "object") {
				$.each(input, function (_, x) {
					output += x + "\n";
				});
			}
			else {
				output = input;
			}
			return output;
		},
		commands = {
			ping: {
				exec: function (loc, num, timeInSeconds) {
					var term = this, step, isAvailable = hg.network.ping(loc);
					if (! num) { num = 5; }
					if (! timeInSeconds) {
						timeInSeconds = 1;
					}
					step = function () {
						term.echo("Pinging " + loc + " ... OK");
						num -= 1;
						if (num > 0) { 
							setTimeout(step, timeInSeconds*1000); 
						}
					};
					step();
				},
				help: ["ping - send a ping package to remote computer", 
					   "Usage: ping IP|DOMAIN [NUMBER_OF_PINGS [TIME]]",
					   "TIME is in seconds."]
			},
			eval: {
				help: ["eval - execute a JavaScript command", 
					   "Usage: eval COMMAND"]
			},
			export: {
				help: ["export - store a variable"]
			},
			help: {
				exec: function(command) {
					var term = this;
					if (!command) {
						this.echo("Available commands: ");
						$.each(commands, function (cmnd, props) {
							term.echo(props.help[0]);
						});
						this.echo("\nFor more information type: help COMMAND");
					}
					else if (commands[command]){
						this.echo(toText(commands[command].help));
					}
					else {
						this.error("No information on command " + command);
					}
				},
				help: ["help - display help information", 
					   "Usage: help COMMAND"]
			}
		};
	hg.exec = function(input, term) {
		var segments = input.split(" "),
			fn = segments[0],
			result,
			noError = true,
			attributes = segments.length > 1 ? segments.slice(1) : null;
		if (commands[fn] && commands[fn].exec) {
			commands[fn].exec.apply(term, attributes);
		}
		else if(fn === "eval" || fn === "export") {
			if (attributes) {
				try {
					result = window.eval(attributes.join(" "));
					if (result !== undefined) {
						term.echo(new String(result));
					}
				} catch(e) {
					term.error(new String(e));
            	}
			}
		}
		else {
			noError = false;
			term.error("Command is not defined!");
		}
		if (noError && hg.callback) {
			// Callback is the main task checker.
			// If the input passes the callback
			// You can move to the next task
			var callbackResult = hg.callback.call(term, input),
				status;
			if (callbackResult) {
				status = hg.state.assignment.nextTask();
				if (! status) {
					hg.state.assignment.completeAssignment();
				}
			}
		}
	};
})(jQuery, HackerGame);

