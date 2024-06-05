import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-paper";

type propsType = {
  label: string;
  isLoading: boolean;
  handlePress: () => void;
};

const LoadingButton = ({ label, isLoading, handlePress }: propsType) => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 15,
    paddingRight: 20,
    width: "auto",
    height: "auto",
  },
});

export default LoadingButton;
