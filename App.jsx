import React from 'react';
import ReactDOM from 'react-dom';

function hasClass(elem, klass){
     return (" "+elem.className+" ").indexOf(" "+klass+" ")>-1;
}

function calculate(state){

  var num = state['name'].length;
  var p = state['food'];
  var shares = new Array(num+1).join('0').split('').map(parseFloat);
  for(var key in p)
    if(p.hasOwnProperty(key)){
      var x= p[key].people;
      var base = parseFloat(p[key].price/x.length).toFixed(2);
      for(var k in x)
        if(x.hasOwnProperty(k))
          shares[parseInt(x[k].id) -1] += parseFloat(base);
    }
  var f = state['name'];
  for(var i=0;i<num;++i)
    f[i].share = shares[i];
  return f;

}

class App extends React.Component {
  constructor(props){
    super(props);
    this.uid = 1;
    this.fid = 1;
    this.state = {
       name:[],
       food:[]
    }
    this.addName = this.addName.bind(this);
    this.addFood = this.addFood.bind(this);
    this.addPrice = this.addPrice.bind(this);
    this.personAdder = this.personAdder.bind(this);

  }

  addName(e){
    if(e.keyCode==13){
      var arr = {n: e.target.value, id: this.uid, share: '0'};
      this.uid++;
      this.setState({name: this.state['name'].concat(arr)}, function(){
        this.setState({name: calculate(this.state)}, function(){
          console.log(JSON.stringify(this.state));
        });
      });
      e.target.value="";
    }
  }

  addFood(e){
    if(e.keyCode==13){
      var arr = {n: e.target.value, id: this.fid, price: '0', people:[]};
      this.fid++;
      this.setState({food: this.state['food'].concat(arr)}, function(){
        this.setState({name: calculate(this.state)}, function(){
          console.log(JSON.stringify(this.state));
        });
      });
      e.target.value="";
    }
  }

  addPrice(e){
    if(e.keyCode==13){
      var food = e.target.getAttribute('data-foodID');
      var p = this.state['food'];

      for(var key in p)
        if(p.hasOwnProperty(key))
          if(p[key].id==food)
            p[key].price = e.target.value;

      this.setState({food: p}, function(){
        this.setState({name: calculate(this.state)}, function(){
          for(var i=0;i<5;++i){/* */}
        });
      });
      console.log(this.state);
    }
  }

  personAdder(e){
    var food = e.target.getAttribute('data-foodID');
    var dude = e.target.getAttribute('data-pid');
    var p = this.state['food'];
    var fin = {
                name: this.state.name,
                food: []
              };
    for(var key in p){
      if(p.hasOwnProperty(key)){
        if(p[key].id==food){
          if(hasClass(e.target, "selected")){
            e.target.className= "coolBox";
            var x = p[key].people;
            x = x.filter(function(col){
              return col.id != dude;
            });
            var big = {n: p[key].n, id: p[key].id, price: p[key].price, people: x};
            fin.food.push(big);
          }
          else {
            e.target.className+= " selected";
            var arr = {n: e.target.value, id: dude};
            var big = {n: p[key].n, id: p[key].id, price: p[key].price, people: p[key].people};
            big.people.push(arr);
            fin.food.push(big);
          }
        }
        else
          fin.food.push({n: p[key].n, id: p[key].id, price: p[key].price, people: p[key].people});
      }
    }
    this.setState(fin, function(){
      this.setState({name: calculate(this.state)}, function(){
        console.log(JSON.stringify(this.state));
      });
    });
  }

  render() {
    return (
       <div>
          Enter everyone's names: <InputBox id='names' onkey={this.addName}/><br/><br/>
          {this.state.name.map((n, i) => <CoolBox key = {i} text={n} showShare={true}/> )}<br/><br/>

          Enter all food items: <InputBox id='foods' onkey={this.addFood} data={this.state.food}/><br/><br/>
          {this.state.food.map((f, i) => <Food price={this.addPrice} addPerson= {this.personAdder} key ={i} foodItem={f} people={this.state.name}/>)}
       </div>
    );
  }
}

class InputBox extends React.Component {

  render() {
    return (
        <input type='text' className='inputbox' id={this.props.id} onKeyUp={this.props.onkey}/>
    );
  }
}

class Food extends React.Component {
   render() {
      return (
         <div className='expadd'>
            <div className='padd'>
              <span className='h2'>{this.props.foodItem.id}) {this.props.foodItem.n}</span>
              <input onKeyUp={this.props.price} type='text' className='inputbox right' placeholder='Price: ' data-foodID={this.props.foodItem.id}/>
            </div>
            {this.props.people.map((n, i) => <CoolBox add={this.props.addPerson} foodID = {this.props.foodItem.id} key = {i} text={n}/> )}
         </div>
      );
   }
}

class CoolBox extends React.Component {
   render() {
      return (
         <span className='coolBox' onClick={this.props.add} data-foodID={this.props.foodID} data-pid={this.props.text.id}>
            {this.props.text.n} {this.props.showShare? "- Rs."+this.props.text.share:""}
         </span>
      );
   }
}

export default App;
