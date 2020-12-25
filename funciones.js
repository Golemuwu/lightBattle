var pausa              =     0;
var Velocity           =    15;
var these              =  null;

var next_ID = 0;

var screenfunHasStarted = false;

var thisroom =0 ;

var camera_x = 0;
var camera_y = 0;

scr = {
    Approach: function(start,end,step){
        if(start > end){
            return Math.max(end,start-step);
        }else{
            return Math.min(end,start+step);
        };
    },

    sign: function(number){
        return (number > 0)? 1 : ((number < 0)? -1 : 0);
    },

    place_meeting: function(coord_x,coord_y,objeto,take, room){
        //Take indica si quiero un verdadero o falso si existe un objeto ahi o si devuelve el ID del objeto
        //console.log("Colision");

        room = (room == undefined)? thisroom : instancias.indexOf(""+room)+1;

        take = (take == undefined)? false : true;

        var pmv_existe = instancias[room].indexOf("" + objeto);

        var pmv_return = false;

        for(var i = 0; i < ((pmv_existe!==-1)?(instancias[room][pmv_existe+1].length):(-1)); i++){
            //console.log("Colitzao");

            var otherObjetct = instancias[room][pmv_existe+1][i];

            pmv_return = (coord_x > otherObjetct.x && coord_x < otherObjetct.x+otherObjetct.width) && (coord_y > otherObjetct.y && coord_y < otherObjetct.y+otherObjetct.height);

            //Retorna

            if(pmv_return){
                return (take)? otherObjetct.id : true;
            };


        };

        return false;
    },

    findObjectById: function(identificador){
        if(identificador==false){return false};
        /*var object = identificador.split("_").splice(1).join("_");
        var id = identificador.split("_")[0];*/

        //Buscar objeto en lista de instancias




        //Alternativa post Rooms

        //obtener los 3 datos que nos da el identificador

        
        var id="";
        var room="";
        var object="";

        var cadena = identificador.split("");

        var id_finish = false;
        var room_finish = false;

        //Hago un for para separar los datos

        for(var i = 0; i < cadena.length ;i++){

            

            id_finish = (cadena[i]==" ")? true : id_finish;

            id += (id_finish)? "" : ""+cadena[i];

            room_finish = (cadena[i]=="_")? true : room_finish;

            room += (room_finish)? "" : ""+cadena[i];

            object+= (room_finish)? ""+cadena[i] : ""; 



        };

        //Le quito a los datos de room y de objeto el primer digito, ya que esta demas al ser el separador

        room = room.substring(2);
        object = object.substring(1);

        //console.log(identificador+ "   "+ id +"owo"+ room + object);
        

        var indexRoom = (instancias.indexOf(room)!==-1)? instancias.indexOf(room)+1 : false;

        var indexObj = (instancias[indexRoom].indexOf(object)!==-1)? instancias[indexRoom].indexOf(object)+1 : false;

        var thatisTheInstance = null;

        

        //Busco la instancia que coincide

        for(var i = 0; i < instancias[indexRoom][indexObj].length && thatisTheInstance==null; i++){

            thatisTheInstance = (instancias[indexRoom][indexObj][i].id == identificador)? i : thatisTheInstance;

        };




















        /*var indexOf = (instancias.indexOf(object)!==-1)? instancias.indexOf(object)+1 : false;

        //Buscar instancia

        var thatisTheInstance = null;

        for(var i = 0; i < instancias[indexOf].length && thatisTheInstance==null; i++){

            thatisTheInstance = (instancias[indexOf][i].id == identificador)? i : thatisTheInstance;

        }*/

        //Retornar instancia
        
        return instancias[indexRoom][indexObj][thatisTheInstance];
    },
};

var other_id;

function saveOther(id){
    other_id = id;
};

function other(){
    return scr.findObjectById(other_id);
};





var teclado={
    teclas_mantenidas: new Array(),
    teclas_pulsadas: new Array(),
    teclas_soltadas: new Array(),
    iniciar: function(){
        document.onkeydown=teclado.guardarTecla;
        document.onkeyup  = teclado.borrarTecla;
    },
    guardarTecla: function(e){
        if (teclado.teclas_mantenidas.indexOf(e.keyCode) == -1){
            teclado.teclas_mantenidas.push(e.keyCode);
            teclado.teclas_pulsadas.push(e.keyCode);
            //console.log(teclado.teclas_pulsadas);
        };
    },
    borrarTecla: function(e){
        var posicion = teclado.teclas_mantenidas.indexOf(e.keyCode);
        if(posicion !== -1){
            teclado.teclas_mantenidas.splice(posicion, 1);
            teclado.teclas_soltadas.push(e.keyCode);
        };
    },
    teclaPulsada: function(codigoTecla){
        return (teclado.teclas_mantenidas.indexOf(codigoTecla) !== -1) ? true : false;
    },
    reiniciar: function(){
        teclado.teclas_pulsadas = new Array;
        teclado.teclas_soltadas = new Array;
    }
};

teclado.iniciar();

function keyboard_checkpress(tecla){
    return teclado.teclas_mantenidas.indexOf(tecla)!== -1;
};

function keyboard_checkreleased(tecla){
    return teclado.teclas_soltadas.indexOf(tecla)!== -1;
};

function keyboard_checkpressed(tecla){
    return teclado.teclas_pulsadas.indexOf(tecla)!== -1;
};


//------------------------
function screenfun(tilesX,tilesY){
    var dimensiones = {
        ancho: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        alto: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        };
    
    if ( dimensiones.ancho/tilesX < dimensiones.alto/tilesY) {
            escala= dimensiones.ancho/tilesX;
    } else {
            escala= dimensiones.alto/tilesY;
    };

    

    if(screenfunHasStarted == false){
    var html = document.getElementById("juego").innerHTML;
    var div= "<canvas id= screen width=1600 height=900></canvas>";
    document.getElementById("juego").innerHTML = html + div;
    screenfunHasStarted = true;

    stk = document.querySelector("canvas").getContext("2d");
    stk.fillStyle="black";
    //stk.translate(2,2);

    //Esto es para la calidad de la pantalla

    stk.width="1600";
    stk.height="900";
    stk.scale(2,2);

    stk.fillRect(0,0,800,450);
    };
    

    var margenGrosor = 1;
    

    document.getElementById("screen").style.width  = (Math.floor(escala * tilesX * 0.9)+ "px");
    document.getElementById("screen").style.height = (Math.floor(escala* tilesY * 0.9)+ "px");

    



    
    document.getElementById("screen").style.border = margenGrosor + "px solid #000000";
    //console.log(dimensiones.alto);                                     console.log
    //-----------------Centrar
    document.getElementById("juego").style.position = "absolute";
    document.getElementById("juego").style.left = Math.floor((dimensiones.ancho - (escala * tilesX) * 0.9)* 0.5) - margenGrosor+ "px" ;//aca va lo de sumarle pixeles
    document.getElementById("juego").style.top  = Math.floor((dimensiones.alto  - (escala * tilesY) * 0.9)* 0.5) - margenGrosor+ "px" ;//aca va lo de sumarle pixeles
    //----------------/Centrar

};
    //----------------/Dibujar Numeros

function drawNum(Num,X,Y,esc,color){
    var digitos = Num.toString().split("");

    stk.fillStyle=color;

    for(i=0;i<digitos.length;i++){
        digitos[i] = parseInt(digitos[i]);
    };

    for(j=0; j< digitos.length; j++){
        stk.fillRect(X+(j*4)*esc,Y, esc                             * !(digitos[j]==1)                       , esc*3/4);
        stk.fillRect(X+(j*4+1)*esc,Y, esc                           * !(digitos[j]==1) * !(digitos[j]==4)    , esc*3/4);
        stk.fillRect(X+(j*4+2)*esc,Y, esc                                                                    , esc*3/4);

        stk.fillRect(X+(j*4)*esc,Y+esc*3/4, esc            * !(digitos[j]==1) * !(digitos[j]==2) * !(digitos[j]==3)    , esc*3/4);
        stk.fillRect(X+(j*4+2)*esc,Y+esc*3/4, esc          * !(digitos[j]==5) * !(digitos[j]==6)                       , esc*3/4);

        stk.fillRect(X+(j*4)*esc,Y+esc*3/4*2, esc          * !(digitos[j]==1) * !(digitos[j]==7)                       , esc*3/4);
        stk.fillRect(X+(j*4+1)*esc,Y+esc*3/4*2, esc        * !(digitos[j]==1) * !(digitos[j]==0) * !(digitos[j]==7)    , esc*3/4);
        stk.fillRect(X+(j*4+2)*esc,Y+esc*3/4*2, esc                       , esc*3/4);

        stk.fillRect(X+(j*4)*esc,Y+esc*3/4*3, esc          * !(digitos[j]==1) * !(digitos[j]==3) * !(digitos[j]==4) * !(digitos[j]==5) * !(digitos[j]==7) * !(digitos[j]==9)          , esc*3/4);
        stk.fillRect(X+(j*4+2)*esc,Y+esc*3/4*3, esc        * !(digitos[j]==2)               , esc*3/4);

        stk.fillRect(X+(j*4)*esc,Y+esc*3, esc              * !(digitos[j]==1) * !(digitos[j]==4) * !(digitos[j]==7)            , esc*3/4);
        stk.fillRect(X+(j*4+1)*esc,Y+esc*3, esc            * !(digitos[j]==1) * !(digitos[j]==4) * !(digitos[j]==7)            , esc*3/4);
        stk.fillRect(X+(j*4+2)*esc,Y+esc*3, esc                                                                                , esc*3/4);
    };


    //console.log(digitos);
};



/////// Lo de bucle principal viste? me parece obvio
var buclePrincipal = {
    idEjecucion: null,
    ultimoRegistro: 0,
    aps: 0,
    fps: 0,
    CPA: 0,
    iterar: function(registroTemporal) {
        buclePrincipal.idEjecucion = window.requestAnimationFrame(buclePrincipal.iterar);

        buclePrincipal.actualizar(registroTemporal);
        teclado.reiniciar();

        stk.translate(camera_x,camera_y);
        buclePrincipal.dibujar();
        stk.translate(-camera_x,-camera_y);

        screenfun(16,9);

        if(registroTemporal - buclePrincipal.ultimoRegistro > 999) {
            buclePrincipal.ultimoRegistro = registroTemporal;
            //console.log("APS: " + buclePrincipal.aps + "/ FPS: " + buclePrincipal.fps);
            buclePrincipal.fps = 0;
            buclePrincipal.aps = 0;
            buclePrincipal.CPA=0;
        }
    },
    detener: function() {

    },
    actualizar: function(registroTemporal) {
        

        /*var izquierda =      (teclado.teclas.indexOf("ArrowLeft") !== -1  ||  teclado.teclas.indexOf("a") !== -1);
        var derecha   =      (teclado.teclas.indexOf("ArrowRight")!== -1  ||  teclado.teclas.indexOf("d") !== -1);

        var direccion =  derecha - izquierda;*/

        //instancias[instancias.indexOf("Player")+1][0].x+=direccion;

        for(var k = 0; k < rooms_activas.length; k+=2){

            thisroom = instancias.indexOf(rooms_activas[k])+1;

            

            for(var i = 0; i<instancias[thisroom].length;i+=2){

                

                //Para cada lista de objetos
                for(var j = 0; j < instancias[thisroom][i+1].length; j++){
                    //Para cada objeto en la lista
                    

                    if(matrizStep.indexOf("" + instancias[thisroom][i]) !==-1){
                        these = instancias[thisroom][i+1][j];

                        //Realiza el Step del objeto, en esta instancia

                        

                        matrizStep[matrizStep.indexOf("" + instancias[thisroom][i])+1]();

                        instancias[thisroom][i+1][j] = these;
                    };
                };
            };
        };

        
        buclePrincipal.aps++;
        buclePrincipal.CPA++;


        if(buclePrincipal.CPA >= Velocity+50*pausa){
            buclePrincipal.CPA=0;
        };
        
    },
    dibujar: function(registroTemporal) {
        buclePrincipal.fps++;

        stk.fillStyle="black";
        stk.fillRect(-camera_x+400-400,0,800,450);


        

        



        stk.fillStyle="blue";

        if(instancias[room_dibujada].indexOf("Suelo")!==-1){
            var inOf = instancias[room_dibujada].indexOf("Suelo")+1;
            for(var i = 0; i < instancias[room_dibujada][inOf].length; i++){
                stk.fillRect(instancias[room_dibujada][inOf][i].x,instancias[room_dibujada][inOf][i].y, instancias[room_dibujada][inOf][i].width, instancias[room_dibujada][inOf][i].height);
            }
        };

        stk.fillStyle="orange";

        if(instancias[room_dibujada].indexOf("Enemy")!==-1){
            var inOf = instancias[room_dibujada].indexOf("Enemy")+1;
            for(var i = 0; i < instancias[room_dibujada][inOf].length; i++){
                stk.fillRect(instancias[room_dibujada][inOf][i].x,instancias[room_dibujada][inOf][i].y, instancias[room_dibujada][inOf][i].width, instancias[room_dibujada][inOf][i].height);
            }
        };

        stk.fillStyle="red";

        if(instancias[room_dibujada].indexOf("Player")!==-1){
            var inOf = instancias[room_dibujada].indexOf("Player")+1;
            for(var i = 0; i < instancias[room_dibujada][inOf].length; i++){
                stk.fillRect(instancias[room_dibujada][inOf][i].x,instancias[room_dibujada][inOf][i].y, instancias[room_dibujada][inOf][i].width, instancias[room_dibujada][inOf][i].height);
            }
        };


        stk.fillStyle="red";

        //Con Todas las instancias Player

        /*if(instancias.indexOf("Player")!==-1){
            var inOf = instancias.indexOf("Player")+1;
            for(var i = 0; i < instancias[inOf].length; i++){
                stk.fillRect(instancias[inOf][i].x,instancias[inOf][i].y, instancias[inOf][i].width, instancias[inOf][i].height);

                //Dibujo la vida
                stk.fillStyle="green";
                stk.fillRect(instancias[inOf][i].x,instancias[inOf][i].y-10, instancias[inOf][i].vida, 5);


                stk.fillStyle="red";
            }
        };*/

        for(var i = 0; i<instancias[room_dibujada].length;i+=2){
            //Para cada lista de objetos
            for(var j = 0; j < instancias[room_dibujada][i+1].length; j++){
                //Para cada objeto en la lista

                if(matrizSprites.indexOf(  instancias[room_dibujada][i+1][j].sprite_index) !==-1){
                    

                    //Lo dibuja en sus coordenadas

                    

                    //Busco el sprite de esta instancia

                    var insSpr = matrizSprites[matrizSprites.indexOf(instancias[room_dibujada][i+1][j].sprite_index)+1]; //Diminutivo de instanceSprite

                    var anchura = (instancias[room_dibujada][i+1][j].sprite_width == undefined)? insSpr.x_end : instancias[room_dibujada][i+1][j].sprite_width;
                    var altura  = (instancias[room_dibujada][i+1][j].sprite_height == undefined)? insSpr.y_end : instancias[room_dibujada][i+1][j].sprite_height;

                    instancias[room_dibujada][i+1][j].sprite_subindex = (instancias[room_dibujada][i+1][j].sprite_subindex >= insSpr.length)? 0 : instancias[room_dibujada][i+1][j].sprite_subindex;

                    var num = (instancias[room_dibujada][i+1][j].sprite_subindex==undefined)? 0 : Math.floor(instancias[room_dibujada][i+1][j].sprite_subindex);


                    //stk.drawImage(insSpr.image, insSpr.x_0[0], insSpr.y_0[0], insSpr.x_end, insSpr.y_end, instancias[i+1][j].x, instancias[i+1][j].y, 17, 32);

                    stk.drawImage(insSpr.image, insSpr.x_0[num], insSpr.y_0[num], insSpr.x_end, insSpr.y_end, (instancias[room_dibujada][i+1][j].xreference == undefined)? instancias[room_dibujada][i+1][j].x : instancias[room_dibujada][i+1][j].xreference, (instancias[room_dibujada][i+1][j].yreference == undefined)? instancias[room_dibujada][i+1][j].y : instancias[room_dibujada][i+1][j].yreference, anchura, altura);

                    //La dibujo

                    

                    //console.log("Dibujando");

                    
                };
            };
        };

        for(var i = 0; i < matrizDraw.length; i++){

            if(matrizDraw[i].isSprite==true){}else{
                stk.fillStyle = matrizDraw[i].dirOrColor;
                stk.fillRect(matrizDraw[i].coord_x,matrizDraw[i].coord_y,matrizDraw[i].width,matrizDraw[i].height);
            };
        };

        matrizDraw = [];

        



        

        

        

    },
};


screenfun(20,12);
//20-12-1
matrizSetUp = [];

function addSetUp(objeto,funcion){

    //Busco si ya existe

    var existe_dsu = (matrizSetUp.indexOf(""+objeto)!==-1);

    //Si no existe hago que exista

    if(!existe_dsu){

        matrizSetUp.push(""+objeto);
        matrizSetUp.push(funcion);
    }else{console.log("ERR: Este SetUp ya existe")};

};

matrizStep = [];

function addStep(objeto,funcion){

    //Busco si ya existe

    var existe_dst = (matrizStep.indexOf(objeto)!==-1);

    //Si no existe hago que exista

    if(!existe_dst){

        matrizStep.push(""+objeto);
        matrizStep.push(funcion);
    }else{console.log("ERR: Este Step ya existe")};

};

matrizSprites = [];

function addSprite(nombre,direccion,desde_x,desde_y,hasta_x,hasta_y,length){

    //Debo ingresar los datos en forma de matriz, y asi elaborar la animacion uwu

    var aux = new Image;
    aux.src = direccion;

    
    matrizSprites.push(""+nombre);
    var sprite = {
        image: aux,  //La direccion desde la que carga la imagen
        x_0: desde_x, 
        y_0: desde_y,
        x_end: hasta_x,
        y_end: hasta_y,
        length: length, //Cantidad de subimagenes
    };

    matrizSprites.push(sprite);

};


instancias    = [];
rooms_activas = [];
room_dibujada = 1;


function crearInstancia(objeto,x,y,width,height,room){

    room = (room==undefined)? 0 : room;

    //Alto y ancho por defecto
    width  = (width==undefined)? 32 : width;
    height = (height==undefined)? 32 : height;
    //Buscar si ya existen instancias de este objeto
    

    //Si no exisate la room, la creo

    if(instancias.indexOf(""+room)==-1){
        instancias.push(""+room);
        instancias.push([]);
    };

    var thisroom = instancias.indexOf(""+room)+1;



    //Si no existe crea un elemento llamado asi en el array, y  en el siguiente bloque pone un array de sus instancias
    
    var existen = (instancias[thisroom].indexOf(objeto)!=-1);
    
    
    if(!existen){
        instancias[thisroom].push(""+objeto);
        instancias[thisroom].push([]);
    };

    //Crea la nueva instancia

    var nuevaInstancia ={
        objeto: ""+objeto,
        id: next_ID + " " + room +"_" + objeto,
        nombre:"",
        x: x,
        y: y,
        width: width,
        height: height,
        rooms: room,
    };

    //Actualizo el valor de la siguiente id

    next_ID++;

    //Se fija que ya haya un espacio para las instancias en esta room

    








    //Coloca la nueva instancia

    instancias[thisroom][instancias[thisroom].indexOf(""+objeto)+1].push(nuevaInstancia);

    //Ejecuto el setUp

    if(matrizSetUp.indexOf("" + objeto) !==-1){
        //these = instancias[thisroom][instancias[thisroom].indexOf(objeto)+1][instancias[instancias[thisroom].indexOf(objeto)+1].length-1];


        these = instancias[thisroom][instancias[thisroom].indexOf(""+objeto)+1][                instancias[thisroom][instancias[thisroom].indexOf(""+objeto)+1].length-1                                 ];
        //Realiza el Step del objeto, en esta instancia

        

        matrizSetUp[matrizSetUp.indexOf("" + objeto)+1]();

        instancias[thisroom][instancias[thisroom].indexOf(""+objeto)+1][                instancias[thisroom][instancias[thisroom].indexOf(""+objeto)+1].length-1                                 ] = these;

        //Nota : Probablemente al crear una instancia desde otra se cree un bug por cambiar el significado de these
    };


};

matrizDraw = [];

function addDraw(isSprite,dirOrColor,coord_x,coord_y,ancho,alto){

    var draw ={
        isSprite: isSprite,
        dirOrColor: dirOrColor, //Esto indica el color si no es sprite, y el sprite si es sprite
        coord_x: coord_x,
        coord_y: coord_y,
        width: ancho,
        height: alto,
    };

    matrizDraw.push(draw);
};

//En el evento dibujar, basicamente se repite lo que sucede al dibujar sprites



























//---------------------------------------------FRONTERAAAAAAAA
//,17,17*2,17*3,17*4,17*5,17*6,17*7

rooms_activas.push("0");


addSprite("Player_walk_rigth","Player_1_walk.png",[0,1024,1024*2,1024*3,1024*4,1024*5,1024*6,1024*7],[0,0,0,0,0,0,0,0],1024,1024,8);
/*addSprite("Player_walk_left","Player_1_walk_left.png",[1024*7,1024*6,1024*5,1024*4,1024*3,1024*2,1024,0],[0,0,0,0,0,0,0,0],1024,1024,8);
addSprite("Player_idle_rigth","Player_1_idle_rigth.png",[0,1024],[0,0],1024,1024,2);
addSprite("Player_idle_left","Player_1_idle_left.png",[0,1024],[0,0],1024,1024,2);
addSprite("Player_punch_rigth","Player_1_Punch_rigth.png",[0,1024,1024*2,1024*3,1024*4,1024*5,1024*6,1024*7],[0,0,0,0,0,0,0,0],1024,1024,8);

addSprite("Player_glargo_rigth","Player_1_gl_r.png",[0,1024,1024*2,1024*3],[0,0,0,0],1024,1024,4);*/



function generarVida() {
    

    var cantidad = Math.floor(Math.random() * (1+5-1)+1);

    var aux = [];

    //console.log(cantidad);

    for(var i = 0; i < cantidad; i++){
        aux.push( (Math.random() >= 0.5)? 1 : 0);
    };

    //return (aux >= 0.5)? 400 : -400;

    return aux;




};


addSetUp("Player",function(){
    these.stun=0;
    these.hasPunched = 0;
    these.puntos = 0;
})


addStep("Player",function(){

    //these.x = (these.x > 400)? these.x-1 : these.x+1;

    these.stun = (these.stun > 0 )? these.stun-1 : 0;
    these.hasPunched = (these.hasPunched > 0 )? these.hasPunched-1 : 0;

    var rango = 200;

    if(keyboard_checkpressed(39) && these.stun == 0){

        var EstaALaDerecha = false;

        for(var i = 0; i < instancias[thisroom][instancias[thisroom].indexOf("Enemy")+1].length; i++){
            
            EstaALaDerecha = (instancias[thisroom][instancias[thisroom].indexOf("Enemy")+1][i].x > these.x && (EstaALaDerecha==false || instancias[thisroom][instancias[thisroom].indexOf("Enemy")+1][i].x < scr.findObjectById(EstaALaDerecha).x))? instancias[thisroom][instancias[thisroom].indexOf("Enemy")+1][i].id : EstaALaDerecha;

        };

        EstaALaDerecha = (scr.findObjectById(EstaALaDerecha).x - these.x < rango)? EstaALaDerecha : false;

        if(EstaALaDerecha !== false){   // SI hay un enemigo por aca (Derecha)
            //Lo mata y reemplaza su lugar

            these.x= scr.findObjectById(EstaALaDerecha).x-32;

            //scr.findObjectById(EstaALaDerecha).x= generarCoords()+these.x;

            scr.findObjectById(EstaALaDerecha).life = scr.findObjectById(EstaALaDerecha).life.splice(1);

            scr.findObjectById(EstaALaDerecha).x = (scr.findObjectById(EstaALaDerecha).life[0] == 0)? scr.findObjectById(EstaALaDerecha).x : these.x-(rango-2);

            these.hasPunched=20;
            these.puntos++;


        }else{
            //Si no hay un personaje sale stun

            these.stun = 30;
        };
    };

    if(keyboard_checkpressed(37) && these.stun == 0){

        var EstaALaIzquierda = false;

        for(var i = 0; i < instancias[thisroom][instancias[thisroom].indexOf("Enemy")+1].length; i++){
            
            EstaALaIzquierda = (instancias[thisroom][instancias[thisroom].indexOf("Enemy")+1][i].x < these.x && (EstaALaIzquierda==false || instancias[thisroom][instancias[thisroom].indexOf("Enemy")+1][i].x > scr.findObjectById(EstaALaIzquierda).x))? instancias[thisroom][instancias[thisroom].indexOf("Enemy")+1][i].id : EstaALaIzquierda;

        };

        EstaALaIzquierda = ( these.x - scr.findObjectById(EstaALaIzquierda).x < rango)? EstaALaIzquierda : false;

        if(EstaALaIzquierda !== false){   // SI hay un enemigo por aca (Izquieerda)
            //Lo mata y reemplaza su lugar

            these.x= scr.findObjectById(EstaALaIzquierda).x+32;

            //scr.findObjectById(EstaALaIzquierda).x= generarCoords()+these.x;

            scr.findObjectById(EstaALaIzquierda).life = scr.findObjectById(EstaALaIzquierda).life.splice(1);

            scr.findObjectById(EstaALaIzquierda).x = (scr.findObjectById(EstaALaIzquierda).life[0] == 1)? scr.findObjectById(EstaALaIzquierda).x : these.x+(rango-2);

            

            these.hasPunched=20;
            these.puntos++;


        }else{
            //Si no hay un personaje sale stun

            these.stun = 30;
        };
    };

    idJugador = these.id;


    camera_x = -these.x+400;


    if(these.stun == 0) {addDraw(false,"green",these.x-rango,these.y+40,rango*2,2)};

    console.log(these.puntos);
    
    
});


addSetUp("Enemy",function(){
    these.life = [];
})

addStep("Enemy",function(){

    if(these.life.length ==0){
        these.life = generarVida();


        these.x = (these.life[0]==0)? scr.findObjectById(idJugador).x+400 : scr.findObjectById(idJugador).x -400;
    };

    var canMove = scr.findObjectById(idJugador).hasPunched == 0 ;

    var puntos = scr.findObjectById(idJugador).puntos/2
    puntos = (puntos > 14)? 7 : puntos/2;

    these.x = (canMove)? ((these.x > scr.findObjectById(idJugador).x)? these.x-3-puntos : these.x+3+puntos) : these.x;


    

    //addDraw(false,"green",these.x,these.y-20,50,2)
    //addDraw(false,"green",these.x,these.y-20,32,2);

    for(var i =0; i <these.life.length; i++){

        var color = (these.life[i]==1)? "red" : "blue";

        addDraw(false,color,these.x,these.y-20- i *8,32,5);

    };


    
})





/*crearInstancia("Suelo",40,200,130,20);
crearInstancia("Suelo",40,330,130,20);
crearInstancia("Suelo",340,200,120,20);
crearInstancia("Suelo",200,250,120,20);

crearInstancia("Suelo",300,410,200,20);
crearInstancia("Suelo",0,430,800,20);

crearInstancia("Suelo",0,0,20,430);

crearInstancia("Fuego",60,410,20,20);*/

//crearInstancia("Player",20,60,10,20);


crearInstancia("Player",400,225);

crearInstancia("Enemy",0,225);
crearInstancia("Enemy",800,225);

//instancias[1][instancias.indexOf("Player")+1][0].ganasDeVivir="Pocas";

console.log(instancias);








buclePrincipal.iterar();


