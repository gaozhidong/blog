/**
 *  
 * @return Object literal singleton instance of DatePicker
 */
var TakePhoto = function() {
	
};

TakePhoto.prototype.takePhoto = function(action,successCallback, failureCallback,jsonobj) {
	 return PhoneGap.exec( 
	 successCallback,    //Success callback from the plugin
	 failureCallback,     //Error callback from the plugin
	 'TakePhotoPlugin',  //Tell PhoneGap to run "DatePickerPlugin" Plugin
	 action,              //Tell plugin, which action we want to perform
	 jsonobj);        //Passing list of args to the plugin
};

/**
 * Enregistre une nouvelle bibliothèque de fonctions
 * auprès de PhoneGap
 **/

PhoneGap.addConstructor(function() {
    //如果不支持window.plugins,则创建并设置
    if(!window.plugins){
        window.plugins={};
    }
    window.plugins.takePhotoPlugin = new TakePhoto();
    //向phonegap中注入插件相关的js
    //Register the javascript plugin with PhoneGap
    PhoneGap.addPlugin('takePhotoPlugin', new TakePhoto());
    //phonegap中注入后台插件相关的java类
    //Register the native class of plugin with PhoneGap
    PluginManager.addService("TakePhotoPlugin","com.moonbasa.zone.plugin.take.photo.TakePhotoPlugin");
});