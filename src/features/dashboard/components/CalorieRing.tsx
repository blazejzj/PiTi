import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

type Props = {
    current: number; // total kcal eaten today
    target: number; // kcal goal
    carbs: number; // grams
    protein: number; // grams
    fat: number; // grams
};

export function CalorieRing({ current, target, carbs, protein, fat }: Props) {
    const size = 180;
    const strokeWidth = 18;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // keep target from destroying any division
    const safeTarget = target > 0 ? target : 1;

    // main lap progress between 0 and 1 -> indicates how far around the track we’ve actually gone
    const mainProgress =
        target > 0 ? Math.min(current, target) / safeTarget : 0;

    const isOver = current > target && target > 0;

    // red “second lap” - conseptually many laps, we just show up to one visually
    const overflowRatio = isOver
        ? Math.min((current - target) / safeTarget, 1)
        : 0;

    const carbKcal = Math.max(0, carbs * 4);
    const proteinKcal = Math.max(0, protein * 4);
    const fatKcal = Math.max(0, fat * 9);

    const totalMacroKcal = carbKcal + proteinKcal + fatKcal;
    const hasMacros = totalMacroKcal > 0;

    // we make a ring like a race track, where each lap is one full circle (100%)
    // we split the "current lap" (mainProgress) by macros
    const getSegmentConfig = () => {
        if (!hasMacros || target <= 0 || mainProgress <= 0) return [];

        type Segment = { color: string; start: number; end: number };
        const segments: Segment[] = [];

        // macro shares of the total macro kcal
        const carbShare = carbKcal / totalMacroKcal;
        const proteinShare = proteinKcal / totalMacroKcal;
        const fatShare = fatKcal / totalMacroKcal;

        const data: { share: number; color: string }[] = [
            { share: carbShare, color: "#FBBF24" }, // carbs - amber
            { share: proteinShare, color: "#6366F1" }, // protein - purpleish
            { share: fatShare, color: "#F97316" }, // fat - onrasje
        ];

        let cursor = 0; // 0–1 along the current lap

        data.forEach((item, idx) => {
            const { share, color } = item;
            if (share <= 0) return;

            const start = cursor;

            const isLast = idx === data.length - 1;
            const idealLength = mainProgress * share;
            const length = isLast
                ? Math.max(0, mainProgress - start)
                : idealLength;

            const end = start + length;

            if (end <= start || length <= 0) {
                cursor = end;
                return;
            }

            cursor = end;
            segments.push({ color, start, end });
        });

        return segments;
    };

    const segments = getSegmentConfig();

    return (
        <View className="items-center justify-center">
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E5E7EB" // neutral-200
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* macro lap - IMPORTANT! only while you're still on the first lap */}
                {!isOver &&
                    segments.map((seg, i) => {
                        const { start, end, color } = seg;
                        const span = end - start;
                        if (span <= 0) return null;

                        const length = span * circumference;
                        const dashArray = `${length} ${circumference - length}`;

                        // each "segment" starts at 12 oclock,
                        // then we rotate the whole circle by its start-part
                        const angle = -90 + start * 360;

                        return (
                            <Circle
                                key={i}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke={color}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                strokeDasharray={dashArray}
                                strokeDashoffset={0}
                                fill="none"
                                transform={`rotate(${angle} ${size / 2} ${
                                    size / 2
                                })`}
                            />
                        );
                    })}

                {/* unsure if this is needed, but it ensures that if macros add to less than total progress, the remaining bit is drawn */}
                {!isOver && segments.length === 0 && mainProgress > 0 && (
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#111827"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={`${mainProgress * circumference} ${
                            circumference - mainProgress * circumference
                        }`}
                        strokeDashoffset={circumference * (1 - mainProgress)}
                        fill="none"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                )}

                {/* overflow lap - red circle (second lap) */}
                {isOver && overflowRatio > 0 && (
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#EF4444" // red
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        // one red dash, visually up to one extra lap because thers no point i think going more
                        strokeDasharray={`${
                            overflowRatio * circumference
                        } ${circumference}`}
                        strokeDashoffset={0}
                        fill="none"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                )}
            </Svg>

            <View className="absolute items-center justify-center">
                <Text className="text-xs text-neutral-500 mb-1">Calories</Text>
                <Text className="text-2xl font-bold text-neutral-900">
                    {current}
                    {target > 0 && (
                        <Text className="text-sm text-neutral-500">
                            {" "}
                            / {target}
                        </Text>
                    )}
                </Text>
                {target > 0 && (
                    <Text className="text-xs text-neutral-500 mt-1">
                        {isOver
                            ? `Over by ${current - target} kcal`
                            : `Remaining ${Math.max(0, target - current)} kcal`}
                    </Text>
                )}
                {target === 0 && (
                    <Text className="text-xs text-neutral-400 mt-1">
                        No calorie target set
                    </Text>
                )}
            </View>
        </View>
    );
}
