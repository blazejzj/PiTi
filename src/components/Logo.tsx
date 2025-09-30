import { Image } from "expo-image";
import LogoImg from "../../assets/logo.webp";

export default function Logo() {
    return (
        /* NativeWind doesnt work on Images... We'd have to wrap it or just style like this. */
        <Image
            source={LogoImg}
            style={{ width: 250, height: 128, borderRadius: 12 }}
            contentFit="cover"
            transition={200}
        />
    );
}
