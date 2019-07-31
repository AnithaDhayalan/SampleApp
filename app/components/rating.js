import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../styles/colors';

var { height, width } = Dimensions.get('window');
const Rating = props => {
    const {
        rateColor, rate, rateText, rateTextColor
    } = props;

    return (
        <View style={styles.container}>
            {rate !== 0 ? <View style={styles.flDataRstTiming}>
                <Icon name="stars" size={28} color={rateColor} />
                <Text style={[styles.flDataRstTimeTxt, { alignSelf: 'center', marginLeft: 7, color: rateTextColor }]}>{rate}</Text>
            </View> : <Text style={{ backgroundColor: Colors.customRating, color: Colors.white, justifyContent: 'center', borderRadius: 10, alignSelf: 'center', padding: 5 }}>{rateText != '' ? 'Not rated' : rateText}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center'
    },
    flDataRstTiming: {
        flexDirection: 'row',
        marginTop: 3,
    },
    flDataRstTimeTxt: {
        //borderWidth: 1,
        fontSize: 15,
        marginLeft: 5,
        justifyContent: 'center',
    },

});

export default Rating;
