import { useRef, useState } from "react";
import {
    View,
    Text,
    Image,
    Pressable,
    FlatList,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");

const onboardingData = [
    {
        id: "1",
        image: require("../../assets/images/onboarding-1.png"),
    },
    {
        id: "2",
        image: require("../../assets/images/onboarding-2.png"),
    },
    {
        id: "3",
        image: require("../../assets/images/onboarding-3.png"),
    },
    {
        id: "4",
        image: require("../../assets/images/onboarding-4.png"),
    },
];

export default function Onboarding() {
    const router = useRouter();
    const flatListRef = useRef(null);

    const [currentIndex, setCurrentIndex] = useState(0);

    function handleScroll(event) {
        const index = Math.round(
            event.nativeEvent.contentOffset.x / width
        );

        setCurrentIndex(index);
    }

    async function finishOnboarding() {
        await SecureStore.setItemAsync(
            "onboardingCompleted",
            "true"
        );

        router.replace("/dashboard");
    }

    function handleNext() {
        if (currentIndex === onboardingData.length - 1) {
            finishOnboarding();
            return;
        }

        flatListRef.current?.scrollToIndex({
            index: currentIndex + 1,
            animated: true,
        });
    }

    function handleSkip() {
        finishOnboarding();
    }

    return (
        <View className="flex-1 bg-white">
            <FlatList
                ref={flatListRef}
                data={onboardingData}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{ width }}
                        className="flex-1 items-center justify-center"
                    >
                        <Image
                            source={item.image}
                            style={{
                                width: width,
                                height: "75%",
                            }}
                            resizeMode="contain"
                        />
                    </View>
                )}
            />

            <View className="px-6 pb-8 mb-10">
                <View className="mb-10 flex-row items-center justify-center">
                    {onboardingData.map((_, index) => (
                        <View
                            key={index}
                            className={`mx-1 h-2 w-2 rounded-full ${currentIndex === index
                                ? "bg-black"
                                : "bg-gray-300"
                                }`}
                        />
                    ))}
                </View>
                <View className="flex-row items-center justify-between">
                    <Pressable
                        onPress={handleSkip}
                        className="px-4 py-3"
                    >
                        <Text className="text-base text-gray-500">
                            Skip
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={handleNext}
                        className="rounded-lg bg-black px-6 py-3"
                    >
                        <Text className="text-base font-semibold text-white">
                            {currentIndex === onboardingData.length - 1
                                ? "Get Started"
                                : "Next"}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}