import { useEffect, useRef, useState, useCallback } from "react";
import { Pressable, Text, View, ActivityIndicator, Alert } from "react-native";
import {
    CameraView,
    useCameraPermissions,
    BarcodeScanningResult,
} from "expo-camera";
import { useRouter } from "expo-router";
import Button from "../../../components/Button";
import { account } from "../../../services/appwrite/appwrite";
import { foodItemRepo } from "../repository/foodItemRepo";
import { useMealDraft } from "../state/useMealDraft";
import ScreenContainer from "../../auth/components/ScreenContainer";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const COOLDOWN_MS = 2000;

export default function ScanItemScreen() {
    const router = useRouter();
    const draft = useMealDraft();

    // we need camera permission because we use the camera to scan barcodes
    const [permission, requestPermission] = useCameraPermissions();
    // also this is necessary to avoid multiple scans at once to avoid crashes xD
    const [busy, setBusy] = useState(false);

    // we use refs here to avoid rerenders, its unnecessary because
    // we dont need to show any visual feedback for these values
    // unsure if this is the way here
    const scanningRef = useRef(false);
    const lastCodeRef = useRef<string | null>(null);
    const lastTimeRef = useRef<number>(0);

    useEffect(() => {
        if (!permission) requestPermission();
    }, [permission]);

    // useCallback here to avoid recreating the function on every render
    // no need for that, the depds are stable
    const handleBarcodeScanned = useCallback(
        async (scan: BarcodeScanningResult) => {
            if (scanningRef.current) return;
            const code = scan?.data?.trim();
            if (!code) return;

            const now = Date.now();
            if (
                code === lastCodeRef.current &&
                now - lastTimeRef.current < COOLDOWN_MS
            )
                return;

            scanningRef.current = true;
            setBusy(true);
            lastCodeRef.current = code;
            lastTimeRef.current = now;

            try {
                // get curr user
                const user = await account.get();

                // se if user has this item
                const found = await foodItemRepo.getByBarcode(user.$id, code);
                // if found just add it to the meal draft else go to manual entry with barcode prefilled for later
                if (found) {
                    draft.addItem({
                        foodItemId: found.$id,
                        name: found.name,
                        amountG: 100,
                        kcalPer100g: found.kcalPer100g ?? 0,
                        carbPer100g: found.carbPer100g ?? 0,
                        fatPer100g: found.fatPer100g ?? 0,
                        proteinPer100g: found.proteinPer100g ?? 0,
                    });

                    Toast.show({
                        type: "success",
                        text1: "Added!",
                        text2: `${found.name} added to your meal.`,
                    });

                    router.push("/food/addMeal");
                } else {
                    Toast.show({
                        type: "info",
                        text1: "Not found",
                        text2: "This item is not in your list. Add it manually.",
                    });

                    router.replace({
                        pathname: "/food/manualFoodEntry",
                        params: { barcode: code },
                    });
                }
            } catch {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Could not process scan. Try again.",
                });
            } finally {
                setTimeout(() => {
                    scanningRef.current = false;
                    setBusy(false);
                }, COOLDOWN_MS);
            }
        },
        []
    );

    if (!permission) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator />
                <Text>Requesting camera permission...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-5">
                <Text className="text-center mb-4">
                    We need your permission to use the camera.
                </Text>
                <Button title="Grant permission" onPress={requestPermission} />
            </View>
        );
    }

    return (
        <ScreenContainer className="flex-1 bg-white">
            <View className="px-5 pb-3 flex-row items-center">
                <Pressable onPress={() => router.back()}>
                    <Text className="font-semibold text-neutral-700">
                        ← Back
                    </Text>
                </Pressable>
                <Text className="flex-1 text-center text-2xl font-bold text-neutral-900 mr-10">
                    Scan Barcode
                </Text>
            </View>

            <View className="flex-1 mx-5 rounded-3xl overflow-hidden border-4 border-green-500 relative shadow-md">
                <CameraView
                    style={{ flex: 1 }}
                    facing="back"
                    onBarcodeScanned={busy ? undefined : handleBarcodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: [
                            "ean13",
                            "ean8",
                            "upc_a",
                            "upc_e",
                            "code128",
                            "code39",
                        ],
                    }}
                />
                <View
                    pointerEvents="none"
                    className="absolute inset-0 items-center justify-center"
                >
                    <View className="w-64 h-40 rounded-xl border-[3px] border-white/80" />
                </View>
            </View>

            <Text className="text-center text-sm text-neutral-400 font-medium my-4">
                -- OR --
            </Text>

            <View className="px-5 pb-8">
                <Button
                    title="+ Add Food Manually"
                    variant="secondary"
                    onPress={() => router.push("/food/manualFoodEntry")}
                    textClassName="text-md font-medium text-black"
                    className="w-full rounded-2xl py-4 border-2 border-green-500 bg-white shadow-sm"
                />
            </View>
        </ScreenContainer>
    );
}
