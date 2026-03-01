
        const jsPsych = initJsPsych({
            show_progress_bar: true,
            on_finish: function(data) {
            window.location.href = 'finish.html';
            }
        });


        const subject_id = jsPsych.randomization.randomID(10);
        const filename = `${subject_id}.csv`;

        let timeline = [];
        
        // Preload audio (very important for 72 files!)
        const preload = {
            type: jsPsychPreload,
            audio: tv_array.map(i => i.stimulus)
        };
        timeline.push(preload);

        // TODO: edit the consent form as needed
        const irb = {
            // Which plugin to use
            type: jsPsychHtmlButtonResponse,
            // What should be displayed on the screen
            stimulus: '<p><font size="3">We invite you to participate in a research study on language comprehension of artifical voices.</font></p>',
            // What should the button(s) say
            choices: ['Continue']
        };
        // push to the timeline
        timeline.push(irb)      
        
        // TODO: edit the instruction form as needed
        const instructions = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: "In this experiment, you will hear a series of statements. Following each statement, please indicate whether you believe the statement is true or false. <br>Press <b>D</b> if you believe the statement is <b>TRUE</b>.</p>Press <b>K</b> if you believe the statement is <b>FALSE</b>. <br>When you're ready to begin, press the space bar.",
            choices: [" "]
        };
        timeline.push(instructions);

        let tv_array = create_tv_array(trial_objects);
        const trials = {
            timeline: [
                {
                    type: jsPsychAudioKeyboardResponse,
                    choices: ['d', 'k'],
                    stimulus: jsPsych.timelineVariable('stimulus'),
                    response_allowed_while_playing: true,
                    //trial_duration: 4000,
                    prompt: `<div class=\"option_container\"><div class=\"option\">TRUE<br><br><b>D</b></div><div class=\"option\">FALSE<br><br><b>K</b></div></div>`,
                    data: jsPsych.timelineVariable('data')
                },
                {
                    type: jsPsychHtmlKeyboardResponse,
                    choices: [""],
                    stimulus: "",
                    response_ends_trial: false,
                    trial_duration: 1000
                }
            ],
            timeline_variables: tv_array,
            randomize_order: true
        }
        timeline.push(trials);

        const save_data = {
                    type: jsPsychPipe,
                    action: "save",
                    experiment_id: "XXXXX", // TODO: replace with your experiment ID from DataPipe
                    filename: filename,
                    data_string: ()=>jsPsych.data.get().csv()
                };

        timeline.push(save_data);
        

        jsPsych.run(timeline)
