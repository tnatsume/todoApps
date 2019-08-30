import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  StatusBar, 
  Platform, 
  ScrollView,
  FlatList,
  TextInput,
  Button,
  KeyboardAvoidingView,
  AsyncStrage,
  TouchableOpacity,
} from 'react-native';

const TODO = "@todoapp.todo"

const STATUSBAR_HEIGHT = Platform.OS == 'ios' ? 20 : StatusBar.currentHeight;

const TodoItem =(props) =>{
  let textStyle = styles.todoItem
  if(props.done === true){
    textStyle = styles.todoItemDone
  }
  return (
    <TouchableOpacity onPress={props.onTapTodoItem}>
      <Text style={textStyle}>{props.title}</Text>
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
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.filter}>

          <TextInput
            onChangeText={(text)=>this.setState({filterText:text})}
            value={this.state.filterText}
            style={styles.inputText}
            placeholder="Type filter text"
          />
        </View>
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
          <TextInput
            onChangeText={(text) => this.setState({inputText:text})}
            value={this.state.inputText}
            style={styles.inputText}
          />
          <Button
            onPress={this.onAddItem}
            title="Add"
            color="#841584"
            style={styles.inputButton}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
    paddingTop:STATUSBAR_HEIGHT ,
  },
  // 追加したUIのスタイル
  filter:{
    height:30,
  },
  input:{
    height:30,
    flexDirection:'row',
    borderColor:"#333",
    borderWidth: 1,
    borderBottomLeftRadius:5,
    borderTopRightRadius:5,
    borderBottomRightRadius:5,
    borderTopLeftRadius:5,
    
  },
  inputText:{
    flex:1,
  },
  inputButton:{
    width:100,
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