/**
 * @file 实现开发环境下远程访问E515,E529盒子同步文件和执行命令封装
 * 
 *		ssh2's exec() is typically for executing one-liner commands, 
 *		so it does not persist "shell state" between conn.exec() 
 *		calls (e.g. working directory, etc.). You should also be 
 *		aware of possible limits by your SSH server has set up as
 *		far as how many simultaneous shell/exec requests are allowed
 *		per connection. I think the default limit for this on 
 *		OpenSSH's server is 10.
 *
 *	启动格式：被应用程序调用
 *
 *	文件名			:ssh2promise.js	
 *	编程者			:Awen
 *	日期			:2018.3.24	
 *	项目名			:车联网超级终端 Platform技术预研	
 *	操作系统		:Cross
 *
 *	编号----日期--------注释-------------------------------
 *	00		17.10.25	初期作成
 *	01		17.10.26	修改×××
 */
"use strict"

var Client = require("ssh2").Client;
var fs = require("fs");
var path = require('path');

var through = require('through');
var util = require("util")
var events = require("events");

function SSH2UTILS() {
	this.conn = new Client();
}

/**
* 描述：连接远程机器
* 参数：server,远程机器地址信息；
*		then,回调函数
*/
SSH2UTILS.prototype.connect = function (server, then) {
	var that = this;
	if (then) {
		that.conn.on('ready', function () {
			console.log(server['host'] + ' ready!\n');
			if (then)
				then();
		}).on('error', function (err) {
			console.log(server['host'] + err);
		}).on('close', function (had_error) {
			console.log(server['host'] + ' closed！');
		}).connect(server);
	} else {
		return new Promise(function (resolve, reject) {
			that.conn.on('ready', function () {
				//console.log(server['host'] + ' ready!\n');
				resolve("ready");
			}).on('error', function (err) {
				//console.log("error");
				reject("error");
			}).on('close', function (had_error) {
				//console.log('close');
				reject("close");
			}).connect(server);
		});
	}
};

/**
* 描述：断开远程连接
* 参数：then,回调函数
*/
SSH2UTILS.prototype.disconnect = function (then) {
	var that = this;
	if (then) {
		this.conn.on('end', function () {
			if (then)
				then();
		});
		this.conn.end();
	} else {
		return new Promise(function (resolve, reject) {
			that.conn.on('end', function () {
				resolve('end');
			}).end();
		});
	}
};

/**
* 描述：执行shell命令
* 参数：cmd,要执行的命令；
*		then,回调函数
* 回调：then(err, data):data 运行命令之后的返回信息
*/
SSH2UTILS.prototype.exec = function (cmd, then) {
	var that = this;
	if (then) {
		this.conn.exec(cmd, function (err, stream) {
			var data = "";
			stream.pipe(through(function onWrite(buf) {
				data = data + buf;
			}, function onEnd() {
				stream.unpipe();
			}));
			stream.on('close', function () {
				console.log(cmd);
				if (then)
					then(null, '' + data);
			});
		});
	} else {
		return new Promise(function (resolve, reject) {
			that.conn.exec(cmd, function (err, stream) {
				var data = "";
				stream.pipe(through(function onWrite(buf) {
					data = data + buf;
				}, function onEnd() {
					stream.unpipe();
				}));
				stream.on('close', function () {
					resolve(data);
				});
			});
		});
	}
};

/**
* 描述：上传文件
* 参数：localPath,本地路径
*		remotePath,远程路径
*		then,回调函数
* 回调：then(err, result)
*/
SSH2UTILS.prototype.uploadFile = function (localPath, remotePath, then) {
	var that = this;
	if (then) {
		this.conn.sftp(function (err, sftp) {
			if (err) {
				if (then)
					then(err);
			} else {
				sftp.fastPut(localPath, remotePath, function (err, result) {
					sftp.end();
					if (then)
						then(err, result);
				});
			}
		});
	} else {
		return new Promise(function (resolve, reject) {
			that.conn.sftp(function (err, sftp) {
				if (err)
					reject(err)
				else {
					sftp.fastPut(localPath, remotePath, function (err) {
						sftp.end();
						if (err)
						{
							err.message = err.message + ":" + remotePath;
							reject(err);
						}
							else
							resolve('uploaded:' + remotePath);
					});
				}
			});
		});
	}
};
/**
* 描述：获取本地指定目录下的所有文件列表信息(不包含排除目录或文件)
* 参数：fs 文件模块，
*		path 路径解析模块，
*		root 指定目录，
*		exlcude 排除目录
*/
SSH2UTILS.prototype.getAllFiles = function getAllFiles(fs, path, root, exclude) {
	var bn = path.basename(path.resolve(root));
	if (exclude.includes(bn)) {
		return [];
	}
	var stat = fs.statSync(root);
	var res = [];
	if (stat.isFile()) {
		res.push(root);
	} else if (stat.isDirectory()) {
		var files = fs.readdirSync(root);
		files.forEach(function (file) {
			var pathname = root + path.sep + file
				, stat = fs.statSync(pathname);

			if (!stat.isDirectory()) {
				res.push(pathname);
			} else {
				res = res.concat(getAllFiles(fs, path, pathname, exclude));
			}
		});
	}
	return res;
}
/**
* 描述：获取本地配置文件信息以联接ssh2服务器
*       如果文件不存在或者非法，将按缺省模式重创建文件
* 参数：fs 文件模块，
*		fp file path of the config file，
*		cb callback 回调函数
*/
SSH2UTILS.prototype.initConfig = function initConfig(fs, fp, cb) {
	let config = null;

	fs.readFile(fp, (err, data) => {
		if (err) {
			//console.log(err);
			config = {
				host: "192.168.75.130",
				port: 22,
				username: "lvyu",
				password: "123456",
				remotePath: "~",
				localPath: "e:/_proj/driver/node-v6.11.3/Debug/iovBOX/",
				exclude: ['.git', '.vscode']
			};
			fs.writeFile(fp, JSON.stringify(config), (err) => {
				if (err)
					cb(err);
				else
					cb(null, config);
			});
		} else {
			try {
				config = JSON.parse(data);
				cb(null, config);
			} catch (e) {
				cb(e);
			}
		}
	});
}
/**
* 描述：获取本地配置文件信息以联接ssh2服务器(同步版本)
*       如果文件不存在或者非法，将按缺省模式重创建文件
* 参数：fs 文件模块，
*		fp file path of the config file，
*		cb callback 回调函数
*/
SSH2UTILS.prototype.initConfigSync = function initConfigSync(fs, config_file) {
	let config = null;
	try {
		config = JSON.parse(fs.readFileSync(config_file));
	} catch (e) {
		console.log(e);
		config = {
			host: "192.168.75.130",
			port: 22,
			username: "lvyu",
			password: "123456",
			remotePath: "~",
			localPath: "e:/_proj/driver/node-v6.11.3/Debug/iovBOX/",
			exclude: ['.git', '.vscode']
		};
		fs.writeFileSync(config_file, JSON.stringify(config));
	}
	return config;
}
// /**
// * 描述：上传文件
// * 参数：localPath,本地路径
// *		remotePath,远程路径
// *		then,回调函数
// * 回调：then(err, result)
// */
// SSH2UTILS.prototype.downloadFile = function (remotePath, localPath, then) {
// 	this.conn.sftp(function (err, sftp) {
// 		if (err) {
// 			if (then)
// 				then(err);
// 		} else {
// 			sftp.fastGet(remotePath, localPath, function (err, result) {
// 				if (err) {
// 					if (then)
// 						then(err);
// 				} else {
// 					sftp.end();
// 					if (then)
// 						then(err, result);
// 				}
// 			});
// 		}
// 	});
// };

// /**
// * 描述：获取远程文件路径下文件列表信息
// * 参数  remotePath 远程路径；
// *		isFile 是否是获取文件，true获取文件信息，false获取目录信息；
// *		then 回调函数
// * 回调：then(err, dirs) ： dir, 获取的列表信息
// */
// SSH2UTILS.prototype.getFileOrDirList = function (remotePath, isFile, then) {
// 	var cmd = "find " + remotePath + " -type " + (isFile == true ? "f" : "d") + "\nexit\n";
// 	this.exec(cmd, function (err, data) {
// 		var arr = [];
// 		var dirs = [];
// 		arr = data.split("\r\n");
// 		arr.forEach(function (dir) {
// 			if (dir.indexOf(remotePath) == 0) {
// 				dirs.push(dir);
// 			}
// 		});
// 		if (then)
// 			then(err, dirs);
// 	});
// };


// /**
// * 描述：控制上传或者下载一个一个的执行
// */
// function Control() {
// 	events.EventEmitter.call(this);
// }
// util.inherits(Control, events.EventEmitter); // 使这个类继承EventEmitter

// var control = new Control();

// control.on("donext", function (todos, then) {
// 	if (todos.length > 0) {
// 		var func = todos.shift();
// 		func(function (err, result) {
// 			if (err) {
// 				then(err);
// 				return;
// 			}
// 			control.emit("donext", todos, then);
// 		});
// 	} else {
// 		then(null);
// 	}
// });

// /**
// * 描述：下载目录到本地
// * 参数: remotePath 远程路径；
// *		localDir 本地路径，
// *		then 回调函数
// * 回调：then(err)
// */
// SSH2UTILS.prototype.downloadDir = function (remoteDir, localDir, then) {
// 	var that = this;
// 	that.getFileOrDirList(remoteDir, false, function (err, dirs) {
// 		if (err) {
// 			if (then)
// 				then(err);
// 			return;
// 		} else {
// 			that.getFileOrDirList(remoteDir, true, function (err, files) {
// 				if (err) {
// 					if (then)
// 						then(err);
// 				} else {
// 					dirs.shift();
// 					dirs.forEach(function (dir) {
// 						var tmpDir = path.join(localDir, dir.slice(remoteDir.length + 1)).replace(/[//]\g/, '\\');
// 						// 创建目录
// 						fs.mkdirSync(tmpDir);
// 					});
// 					var todoFiles = [];
// 					files.forEach(function (file) {
// 						var tmpPath = path.join(localDir, file.slice(remoteDir.length + 1)).replace(/[//]\g/, '\\');
// 						todoFiles.push(function (done) {
// 							// that.downloadFile(file, tmpPath, done);
// 							that.downloadFile(file, tmpPath, function (err, result) {
// 								done(err, result);
// 							});
// 							console.log("downloading the " + file);
// 						});// end of todoFiles.push						
// 					});
// 					control.emit("donext", todoFiles, then);
// 				}
// 			});
// 		}
// 	});
// };

// /**
// * 描述：获取windows上的文件目录以及文件列表信息
// * 参数：localDir 本地路径，
// *		dirs 目录列表
// *		files 文件列表
// */
// function getFileAndDirList(localDir, dirs, files) {
// 	var dir = fs.readdirSync(localDir);
// 	for (var i = 0; i < dir.length; i++) {
// 		var p = path.join(localDir, dir[i]);
// 		var stat = fs.statSync(p);
// 		if (stat.isDirectory()) {
// 			dirs.push(p);
// 			getFileAndDirList(p, dirs, files);
// 		}
// 		else {
// 			files.push(p);
// 		}
// 	}
// }


// /**
// * 描述：上传文件到远程linux机器
// * 参数: remotePath 远程路径；
// *		localDir 本地路径，
// *		then 回调函数
// * 回调：then(err)
// */
// var cnt = 0;
// SSH2UTILS.prototype.uploadDir = function (localDir, remoteDir, then) {
// 	var that = this;
// 	var dirs = [];
// 	var files = [];
// 	getFileAndDirList(localDir, dirs, files);

// 	// 创建远程目录
// 	var todoDir = [];
// 	var todoCmd = [];

// 	var fileName = 'tmp_' + cnt + '.sh';
// 	cnt++;
// 	var shCmdFile = fs.createWriteStream(fileName);

// 	dirs.forEach(function (dir) {
// 		var to = path.join(remoteDir, dir.substring(localDir.length + 1)).replace(/[\\]/g, '/');
// 		var cmd = "mkdir -p " + to + "\n";
// 		todoCmd.push(cmd);
// 		fs.appendFileSync(fileName, cmd, 'utf8');
// 	});
// 	shCmdFile.end();

// 	// 上传文件
// 	var todoFile = [];
// 	files.forEach(function (file) {
// 		todoFile.push(function (done) {
// 			var to = path.join(remoteDir, file.substring(localDir.length + 1)).replace(/[\\]/g, '/');
// 			console.log("upload " + file + ' to ' + to);
// 			that.uploadFile(file, to, function (err, result) {
// 				done(err, result);
// 			});
// 		});
// 	});

// 	// 创建根目录
// 	that.exec('mkdir -p ' + remoteDir + '\nexit\n', function (err, data) {
// 		console.log('mkdir -p ' + remoteDir + '\nexit\n');
// 		if (err) {
// 			then(err);
// 		} else {
// 			// 上传命令，运行、删除命令
// 			that.uploadFile(fileName, remoteDir + '/' + fileName, function (err, result) {
// 				fs.unlinkSync(fileName);// 删除命令文件
// 				if (err) throw err;
// 				that.exec('cd ' + remoteDir + '\nsh ' + fileName + '\nrm -rf ' + fileName + '\nexit\n', function (err, date) {
// 					control.emit("donext", todoFile, function (err) {
// 						if (err) throw err;
// 						if (then)
// 							then(err);
// 					});
// 				});
// 			});
// 		}
// 	});
// };

// /**
//  * 描述：创建目录
//  * 参数: remoteDir 远程路径；
//  *		then 回调函数
//  * 回调：then(err, date) : data创建目录之后返回的信息
//  */
// SSH2UTILS.prototype.mkdir = function (remoteDir, then) {
// 	var cmd = 'mkdir -p ' + remoteDir + '\nexit\n';
// 	this.exec(cmd, then);
// };

// /**
//  *  描述：删除目录
//  *  参数：remoteDir 远程路径
//  *       then 回调函数
//  *  回调：then(err, date) : data 删除之后返回的信息
//  */
// SSH2UTILS.prototype.rmdir = function (remoteDir, then) {
// 	var cmd = 'rm -rf ' + remoteDir + '\nexit\n';
// 	this.exec(cmd, then);
// };

exports.SSH2UTILS = SSH2UTILS;
