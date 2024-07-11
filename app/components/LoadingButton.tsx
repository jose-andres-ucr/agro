import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-paper";
import getLoadingButtonStyles from "@/constants/styles/LoadingButtonStyles";
type propsType = {
  label: string;
  isLoading: boolean;
  handlePress: () => void;
};

const LoadingButton = ({ label, isLoading, handlePress }: propsType) => {
  const styles = getLoadingButtonStyles();
  const [opacity, setOpacity] = useState<number>(0);
  useEffect(() => {
    if (isLoading) {
      setOpacity(1);
    } else {
      setOpacity(0);
    }
  }, [isLoading]);
  return (
    <Button
      style={styles.button}
      mode="contained"
      onPress={handlePress}
      disabled={isLoading}
    >
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="small" style={{ opacity: opacity }} />
      </View>
      <Text>{label}</Text>
    </Button>
  );
};

export default LoadingButton;
