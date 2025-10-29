import { useState } from "react";
import { Controller, Control } from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";

type FormInputProps = {
    control: Control<any>;
    name: string;
    label: string;
    rules?: object;
    placeholder?: string;
    disabled?: boolean;
} & Pick<
    TextInputProps,
    "keyboardType" | "autoCapitalize" | "autoCorrect" | "secureTextEntry"
>;

export default function FormInput({
    control,
    name,
    label,
    rules,
    placeholder,
    keyboardType,
    autoCapitalize,
    autoCorrect,
    secureTextEntry,
    disabled = false,
}: FormInputProps) {
    const [fieldFocused, setFieldFocused] = useState(false);

    return (
        <View className="flex gap-2">
            <Text className="text-base font-medium text-neutral-700">
                {label}
            </Text>
            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                }) => (
                    <>
                        <TextInput
                            placeholder={placeholder}
                            onBlur={() => {
                                setFieldFocused(false);
                                onBlur();
                            }}
                            onFocus={() => setFieldFocused(true)}
                            onChangeText={onChange}
                            value={value}
                            keyboardType={keyboardType}
                            autoCapitalize={autoCapitalize}
                            autoCorrect={autoCorrect}
                            secureTextEntry={secureTextEntry}
                            placeholderTextColor="#9CA3AF"
                            className={`p-5 rounded-2xl border bg-neutral-100 text-neutral-900 ${
                                fieldFocused
                                    ? "border-[#41e36f]"
                                    : error
                                    ? "border-red-400"
                                    : "border-neutral-200"
                            }`}
                            editable={!disabled}
                        />
                        {error && (
                            <Text className="text-red-500 text-sm mt-1">
                                {error.message ?? "Invalid value"}
                            </Text>
                        )}
                    </>
                )}
            />
        </View>
    );
}
