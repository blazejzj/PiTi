import React from 'react';
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Button from "../../../components/Button";


export default function ScanItemScreen() {
    const router = useRouter();

    const handleManualInput = () => {
        router.push("/food/manualFoodEntry");
    };

    const handleGoBack = () => {
        router.back();
    };

    // todo: camera/scanner logic
    const handleScanComplete = () => {
        console.log("PROTOTYPE: Simulating successful scan and going back.");
        
        //Beta -> pass the scanned item data back to AddMealScreen
        router.back();
    };

    return (
        <View className="flex-1 bg-white p-5">
            
            <Pressable
                onPress={handleGoBack}
                className="mb-6 mt-12 self-start"
            >
                <Text className="font-semibold text-lg text-neutral-700">← Go Back</Text>
            </Pressable>

            <Text className="font-bold text-3xl mb-4 text-center">Scan Barcode</Text>

            <View className="flex-1 items-center justify-center bg-gray-200 rounded-xl my-4 border-2 border-dashed border-gray-400">
                <Text className="text-gray-600 text-lg font-medium">Camera View Active</Text>
                <Text className="text-gray-600 text-md">Place barcode in the frame.</Text>
            </View>

            <Text className="text-center text-sm text-neutral-500 font-medium my-4">— OR —</Text>

            <Button
                title="+ Add food item manually"
                variant="secondary" 
                onPress={handleManualInput}
                textClassName="text-md font-medium text-black"
                className="w-full rounded-xl py-4 border-2 border-green-500 bg-white mb-10" 
            />

        </View>
    );
}