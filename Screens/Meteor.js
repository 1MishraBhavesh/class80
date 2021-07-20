import React ,{Component} from 'react'
import { Text,View,StyleSheet,TouchableOpacity,ImageBackground,Image ,FlatList,SafeAreaView,Platform,StatusBar,Dimensions} from 'react-native'
import  axios from 'axios'

export default class MeteorScreen extends Component{
  constructor(props){
    super(props)
    this.state={
      meteors:{}
    }
  }
  componentDidMount(){
    this.getMeteors()
  }
  renderItem=({item})=>{
    let meteor = item
    let bg_image,speed,size
    if(meteor.threat_score <= 30){
       bg_image =require('../assets/meteor_bg1.png')
       speed=require('../assets/meteor_speed3.gif')
       size=100

    }else if (meteor.threat_score <= 75){
        bg_image =require('../assets/meteor_bg2.png')
       speed=require('../assets/meteor_speed3.gif')
       size=150
 
      
    }else {
        bg_image =require('../assets/meteor_bg3.png')
       speed=require('../assets/meteor_speed3.gif')
       size=200
 
      
    }
    return(
      <View>
         <ImageBackground 
         style={styles.backgroundImage}
         source={bg_image}>

         <View style={styles.gifContainer}>
          <Image
           source={speed}
           style={{width:size,height:size,alignSelf:"center"}} 
          /> 
          <View>
           <Text style={[styles.cardTitle,{marginTop:300,marginLeft:50}]}> {item.name}</Text>
           <Text style={[styles.cardText, { marginTop: 20, marginLeft: 50 }]}>Closest to Earth - {item.close_approach_data[0].close_approach_date_full}</Text>
             <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>Maximum Diameter (KM) - {item.estimated_diameter.kilometers.estimated_diameter_max}</Text>
               <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>Minimum Diameter(KM) - {item.estimated_diameter.kilometers.estimated_diameter_min}</Text>
               <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>Velocity(KM/H) - {item.close_approach_data[0].relative_velocity.kilometers_per_hour}</Text>
               <Text style={[styles.cardText, { marginTop: 2, marginLeft: 50 }]}>Missing Earth By(KM) - {item.close_approach_data[0].miss_distance.kilometers}</Text>
          </View>
         </View>
         </ImageBackground>
      </View>
    )
  }
  getMeteors=()=>{
    axios
      .get("https://api.nasa.gov/neo/rest/v1/feed?api_key=2eCZ725rKYFULUR7qcykeSm770oaYSTcZ4XROABx")
      .then(response=>{
        this.setState({
          meteors:response.data.near_earth_objects
        })
      })
      .catch(error=>{
        alert(error.massege)
      })
  }
  keyExtractor=(item,index)=>{
    index.toString()
  }
    render(){
      if(Object.keys(this.state.meteors).length === 0){
        return(
          <View style={styles.container}>
           
                <Text>  ..Loading </Text>
            </View>
        )
      }else{
        let meteor_arr=Object.keys(this.state.meteors).map (meteor_date => {
          return this.state.meteors[meteor_date]
        })
        let meteors=[].concat.apply([],meteor_arr)
        meteors.forEach(function  (element) {
          let  diameter=(element.estimated_diameter.kilometers.estimated_diameter_min +                 element.estimated_diameter.kilometers.estimated_diameter_max )/2
          let threatScore=(diameter/element.close_approach_data[0].miss_distance.kilometers)*1000000000
          element.threat_score=threatScore

        })
        meteors.sort(function(a,b){
          return b.threat_score-a.threat_score

        })
        meteors=meteors.slice(0,5)
        return(

         <View style={styles.container}> 
            <SafeAreaView
             style={styles.droidSafeArea}
             />
              <FlatList
                keyExtractor={this.keyExtractor}
                data={meteors}
                renderItem={this.renderItem}
                horizontal={true}
              />
            </View>
        )}
    }
}
 const styles=StyleSheet.create({
    container:{
         flex:1,
         justifyContent:"center",
         alignItems:"center"
     },
     droidSafeArea:{
        marginTop:Platform.OS==="android"? StatusBar.currentHeight:0
     },
     backgroundImage:{
       flex:1,

       resizeMode:"cover",
       width:Dimensions.get("window").width,
        height:Dimensions.get("window").height 
     },
     gifContainer:{
       justifyContent:"center",
       flex:1,
       alignItems:"center"
     },
     cardTitle:{
       fontSize:20,
       color:"white",
       fontWeight:"bold",
       marginBottom:10
     },
     cardText:{
       color:"white",
       fontSize:15,
       
     }
 })
 