function create_tv_array(json_object) {
    // Group trials by statement_number
    let groups = {};
    for (let i = 0; i < json_object.length; i++) {
        let sn = json_object[i].statement_number;
        if (!groups[sn]) {
            groups[sn] = [];
        }
        groups[sn].push(json_object[i]);
    }

    // Ensure equal number of true and false selections
    let statement_numbers = Object.keys(groups);
    let n = statement_numbers.length;
    let half = Math.floor(n / 2);

    // Create a shuffled assignment array: half "true", half "false"
    let assignments = [];
    for (let i = 0; i < half; i++) assignments.push("true");
    for (let i = 0; i < n - half; i++) assignments.push("false");
    // Shuffle assignments (Fisher-Yates)
    for (let i = assignments.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [assignments[i], assignments[j]] = [assignments[j], assignments[i]];
    }

    // For each statement_number, pick the version matching the assignment
    let selected = [];
    for (let idx = 0; idx < statement_numbers.length; idx++) {
        let sn = statement_numbers[idx];
        let versions = groups[sn];
        let pick = versions.find(v => v.truth.toLowerCase() === assignments[idx]);
        if (!pick) pick = versions[0]; // fallback
        selected.push(pick);
    }

    // Build timeline variables array from selected trials
    let tv_array = [];
    for (let i = 0; i < selected.length; i++) {
        let obj = {};
        obj.stimulus = selected[i].filename;
        obj.data = {};
        obj.data.statement_number = selected[i].statement_number;
        obj.data.statement = selected[i].statement;
        obj.data.truth = selected[i].truth;
        obj.data.age = selected[i].age;
        obj.data.gender = selected[i].gender;
        tv_array.push(obj);
    }
    return tv_array;
}
