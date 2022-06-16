import React from 'react';
import { StyleSheet } from 'react-native';

export const STYLES = StyleSheet.create({
    container: {
        // flex: 1,
        height: '100%',
        maxWidth: 500,
        backgroundColor: '#333333',
    },
    header: {
        height: '5%',
    },
    north: {
        // height: '30%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        height: '10%',
    },
    south: {
        // height: '55%',
    },

    title: {
        color: 'white',
        fontSize: 50,
        fontStyle: 'italic',
        paddingBottom: 20,
    },

    foundIt: {
        color: 'white',
        fontSize: 30,
        fontStyle: 'italic',
        textAlign: 'center',
    },

    row: {
        flexDirection: 'row',
        paddingBottom: 10,
    },

    button: {
        backgroundColor: 'silver',
        padding: 20,
        borderRadius: 25,
    },

    buttonStandOut: {
        backgroundColor: 'gold',
        padding: 20,
        borderRadius: 25,
    },

    box: {
        flex: 1,
        alignItems: 'center',
    },
    boxFade: {
        flex: 1,
        alignItems: 'center',
        opacity: 0.3,
    },
    box__icon: {

    },
    box__iconHidden: {
        opacity: 0,
    }
});