import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  StatusBar, 
  Platform, 
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  AsyncStrage,
  TouchableOpacity,
} from 'react-native';

import {
  SearchBar,
  Input,
  Button,
  ListItem,
} from 'react-native-elements';

import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

import {ifIphoneX,getStatisBarHeight, getStatusBarHeight} from 'react-native-iphone-x-helper';
const TODO = "@todoapp.todo"

// iPhoneX対応
const STATUSBAR_HEIGHT = getStatusBarHeight()

const TodoItem =(props) =>{
  // let textStyle = styles.todoItem
  // if(props.done === true){
  //   textStyle = styles.todoItemDone
  // }
  let icon = null
  if ( props.done == true){
    icon = <Icon2 name="done" />
  }
  return (
    <TouchableOpacity onPress={props.onTapTodoItem}>
      {/* <Text style={textStyle}>{props.title}</Text> */}
      <ListItem
        title={props.title}
        rightIcon={icon}
        bottomDivider
        />
    </TouchableOpacity>
  )
}
export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      todo: [],
      currentIndex:0,
      inputText:"",
      filterText:"",
    }
  }
  componentDidMount(){
    this.loadTodo()
  }

  loadTodo = async ()=> {
    try {
      const todoString = await AsyncStrage.getItem(TODO);
      if(todoString){
        const todo = JSON.parse(todoString)
        const currentIndex = todo.length
        this.setState({TODO: TODO,currentIndex: currentIndex})
      }
    } catch(e){
      console.log(e)
    }
  }

  saveTodo = async (todo) => {
    try{
      const todoString = JSON.stringify(todo)
      await AsyncStrage.setItem(Todo,todoString)
    }catch(e){
      console.log(e)
    }
  }
  onAddItem = () => {
    const title = this.state.inputText
    if(title == "" ){
      return
    }
    const index = this.state.currentIndex + 1
    const newTodo = {index: index , title: title, done:false}
    const todo = [...this.state.todo, newTodo]
    this.setState({
      todo: todo,
      currentIndex: index,
      inputText:""
    })
    this.saveTodo(todo)
  }

  onTapTodoItem= (todoItem)=>{
    const todo = this.state.todo
    const index = todo.indexOf(todoItem)
    todoItem.done = !todoItem.done
    todo[index] = todoItem
    this.setState({todo:todo})
    this.saveTodo(todo)
  }
  render() {
    const filterText = this.state.filterText
    let todo = this.state.todo
    if(filterText !== ""){
      todo = todo.filter(t=>t.title.includes(filterText))
    }

    const platform = Platform.os == 'ios' ? 'ios' : 'android'

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <SearchBar
          platform={platform}
          cancelButtontTitle='Cancel'
          onChangeText = {(text) => this.setState({filterText: text})}
          onClear={()=>this.setState({filterText:''})}
          value={this.state.filterText}
          placeholder='Type filter text'
          />
        <ScrollView style={styles.todolist}>
          <FlatList data={todo}
            extraData={this.state}
            renderItem={({item}) => 
              <TodoItem
                title={item.title}
                done={item.done}
                onTapTodoItem={()=>this.onTapTodoItem(item)}
                />
            }
            keyExtractor={(item, index) => "todo_" + item.index} 
          />
        </ScrollView>
        <View style={styles.input}>
          <Input
            onChangeText={(text) => this.setState({inputText:text})}
            value={this.state.inputText}
            style={styles.inputText}
          />
          <Button
            icon={
              <Icon
                name='plus'
                size={30}
                color="white"
              />
            }
            onPress={this.onAddItem}
            title=""
            buttonStyle={styles.inputButton}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  input:{
    ...ifIphoneX({
      paddingBottom:30,
      height:80
    },{
      height:50,
      }),
      height:70,
      flexDirection:'row',
      paddingRight:10,

  },
  inputText:{
    paddingLeft:10,
    paddingRight:10,
    flex:1,
  },
  inputButton:{
    width:48,
    height:48,
    borderWidth:0,
    borderColor:'transparent',
    borderRadius:48,
    backgroundColor:'#ff6347',
  },
  container:{
    flex:1,
    backgroundColor:'#fff',
    paddingTop:STATUSBAR_HEIGHT ,
  },
  // 追加したUIのスタイル
  filter:{
    height:30,
  },
  inputText:{
    flex:1,
  },

  todoItem:{
    fontSize:20,
    backgroundColor:"white"
  },
  todoItemDone:{
    fontSize:20,
    backgroundColor:"tomato"
  },
});