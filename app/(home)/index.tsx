import { useEffect, useState } from "react";
import { account } from "../../src/services/appwrite/appwrite";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

/*
THIS COMPONENT IS JUST FOR TESTING PURPOSES. IT SHOULD NOT BE A PART OF THE APPLICATON.
*/
export default function profiletest() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await account.get();
                setUser(user);
            } catch (err) {
                console.log(err);
                router.replace("(auth)/login");
            }
        };

        getUser();
    }, []);

    const handleLogout = async () => {
        await account.deleteSession({ sessionId: "current" });
        router.replace("(auth)/login");
    };

    return (
        <View className="flex-1 justify-center items-center p-10 bg-white">
            {user ? (
                <>
                    <Text className="text-3xl font-bold">
                        Hey man ur cool {user.name}
                    </Text>
                    <Text className="mt-3 text-lg text-neutral-500">
                        Your email is = {user.email}
                    </Text>
                    <Pressable
                        onPress={handleLogout}
                        className="mt-6 p-4 rounded-xl bg-red-500"
                    >
                        <Text className="text-white font-bold">
                            Log out here and test it
                        </Text>
                    </Pressable>
                </>
            ) : (
                <Text>Loaaaading.</Text>
            )}
        </View>
    );
}
