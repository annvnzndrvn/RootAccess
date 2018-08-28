import React, { Component } from 'react';
import VirtualPC from './VirtualPC';
// import RootAccessVM from '../RAL-Core/RootAccessVM';
import Asyncfunctions from '../Utilities/AsyncFunctions';

class ParentContainer extends Component{

    constructor(props){
        super(props);
        this.state = {
            userInfo:{
                username:"",
                email:"",
                id:"",
            },
            clientState:{
                signedIn:false,
            },
            virtualPC:{},
            connection: "",
        }

        this.text = `
        class Firewall::

            func constructor():
                RootAccess.CPU.Threads("Main").Inject(this);
            :end

        ::end

        class Cracker::
            
            func constructor():
                a = 0;
                if(a==0){
                    a=1;
                }
            :end

        ::end

        f = Firewall();
        `;

    //this.compile(this.text);
    this.checkSession();
    this.handleSuccess = this.handleSuccess.bind(this);
    this.checkSession = this.checkSession.bind(this);
    }

    checkSession(){
        Asyncfunctions.CheckSessionAPI()
            .then(res => {
                if(!res.session){return};
                let s = Object.assign({},this.state);
                s.clientState.signedIn = true;
                s.userInfo.email = res.data.email;
                s.userInfo.username = res.data.username;
                s.virtualPC = res.virtualPC;
                this.setState(s);
            })
            .catch(err => console.log(err));
    }

    compile(text){
        this.VM.Compile(this.text);
    }

    handleSuccess(user){
        if(user.data[0]){user.data = user.data[0]}
        let s = Object.assign({}, this.state);
        s.clientState.signedIn = true;
        s.userInfo.email = user.data.email;
        s.userInfo.username = user.data.username;
        s.virtualPC = user.virtualPC;
        this.setState(s);
    }

    render(){
        if(this.state.clientState.signedIn){
            return(
                <div className = "ParentContainer">              
                    <VirtualPC fullscreen={true} state={this.state}/>
                </div>
                
            );
        }else{
            return(
                <div className = "ParentContainer">
                    <VirtualPC onSuccess={this.handleSuccess} fullscreen={true} state={this.state}/>
                </div>
                
            );
        }
    }
    
}

export default ParentContainer;

