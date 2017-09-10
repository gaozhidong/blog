/**
 * 单例模式
 * 
 */

 const singleton = () =>{
     let instance = null;
    let singletonCOnstructor = function(){
        //
    };
    return {
        getInstance :() =>{
            if(instance === null){
                instance = new singletonCOnstructor();
            }
            return instance;
        }
    }
    
 };
