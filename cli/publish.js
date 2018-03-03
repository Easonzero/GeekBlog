/**
 * Created by eason on 16-11-11.
 */
"use strict";
const exec = require('child_process').exec; 
const cmd_cd = 'cd build';
const cmd_add = 'git add .';
const cmd_commit = `git commit -m "update"`;
const cmd_push = `git push origin master`;

module.exports = ()=>{
	exec(`${cmd_cd}&&${cmd_add}&&${cmd_commit}&&${cmd_push}`,function(err,stdout,stderr){
		if(err){
			console.log(stderr);
		}else{
			console.log('success!');
		}
	});
};
