import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import JournalListScreen from './journal/JournalListScreen';
import JournalDetailScreen from './journal/JournalDetailScreen';
import AddEditJournalScreen from './journal/AddEditJournalScreen';

const Stack = createNativeStackNavigator();

export default function JournalScreen() {
return (
    <Stack.Navigator
            screenOptions={{
            headerStyle: { backgroundColor: '#F3EFFF' }, 
            headerTintColor: '#000', 
            headerTitleStyle: { fontWeight: 'bold' }, 
        }}
    >
    <Stack.Screen 
        name="JournalList" 
        component={JournalListScreen} 
        options={{ title: 'Jurnal',  }} 
    />
    <Stack.Screen 
        name="JournalDetail" 
        component={JournalDetailScreen} 
        options={{ title: 'Detail Jurnal' }}
    />
    <Stack.Screen 
        name="AddEditJournal" 
        component={AddEditJournalScreen} 
        options={{ title: 'Jurnal' }} 
    />
    </Stack.Navigator>
);
}
