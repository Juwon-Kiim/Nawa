import React from "react";
import {Text, View, StyleSheet, Button } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

const Mate1 = ( {navigation} ) => {
    return (
      <>
        <View style={styles.processBar}></View>
        <View style={styles.loactionBox}>
          <View style={styles.location}>
            <Text>지도 설정</Text>
          </View>
        </View>
        <View style={styles.buttonBox}>
          <Button
            style={styles.Button}
            title='나가기'
            onPress={() => {navigation.goBack()}}
          >
          </Button>
          <Button
            style={styles.Button}
            title='운동설정'
            onPress={() => {navigation.push('Mate2')}}
          >
          </Button>
        </View>
        
      </>
    );
  }


const styles = StyleSheet.create({
  processBar : {
      backgroundColor : 'lightgrey',
      marginHorizontal :3,
      marginVertical : 3,
      borderRadius : 5,
      height : 30
    },
  loactionBox : {
      flexDirection: 'column',
      backgroundColor : 'lightgrey',
      fontWeight : '900',
      // paddingHorizontal : 10,
      // paddingVertical : 10,
      marginHorizontal :3,
      marginVertical : 3,
      borderRadius : 5,
      height : 440
    },
  location : {
      backgroundColor : 'white',
      marginHorizontal : 3,
      marginTop : 3,
      borderRadius : 10,
      height : 434
    },
  buttonBox : {

    flexDirection: 'row',
    justifyContent : "space-between",
    marginHorizontal : 3,
    
  },
  Button : {
      backgroundColor : 'black',
      marginHorizontal : 10,
      marginTop : 10,
      borderRadius : 20,
    },
})


export default Mate1;