import { type Colors } from '@/components/colors'
import { MapContext } from '@/hooks/contexts/map'
import { type SearchResult } from '@/types/map'
import { getContrastColor } from '@/utils/ui-utils'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import React, { useContext } from 'react'
import { Keyboard, StyleSheet, Text, View } from 'react-native'
import type WebView from 'react-native-webview'

import Divider from '../Universal/Divider'
import PlatformIcon from '../Universal/Icon'
import { _injectMarker, _setView } from './leaflet'

const ResultRow: React.FC<{
    result: SearchResult
    index: number
    colors: Colors
    mapRef: React.RefObject<WebView>
    handlePresentModalPress: () => void
    bottomSheetRef: React.RefObject<any>
}> = ({
    result,
    index,
    colors,
    mapRef,
    handlePresentModalPress,
    bottomSheetRef,
}): JSX.Element => {
    const { setClickedElement, setLocalSearch, setCurrentFloor } =
        useContext(MapContext)
    return (
        <React.Fragment key={index}>
            <TouchableOpacity
                style={styles.searchRowContainer}
                onPress={() => {
                    const center = result.item.options.center
                    Keyboard.dismiss()
                    bottomSheetRef.current?.collapse()
                    _setView(center, mapRef)
                    setClickedElement({
                        data: result.title,
                        type: result.item.options.type,
                    })
                    setCurrentFloor(result.item.properties.Ebene)
                    handlePresentModalPress()
                    _injectMarker(mapRef, center)
                    setLocalSearch('')
                }}
            >
                <View
                    style={{
                        ...styles.searchIconContainer,
                        backgroundColor: colors.primary,
                    }}
                >
                    <PlatformIcon
                        color={getContrastColor(colors.primary)}
                        ios={{
                            name: result.item.options.icon.ios,
                            size: 18,
                        }}
                        android={{
                            name: result.item.options.icon.android,
                            variant: 'outlined',
                            size: 21,
                        }}
                    />
                </View>

                <View>
                    <Text
                        style={{
                            color: colors.text,
                            ...styles.suggestionTitle,
                        }}
                    >
                        {result.title}
                    </Text>
                    <Text
                        style={{
                            color: colors.text,
                            ...styles.suggestionSubtitle,
                        }}
                    >
                        {result.subtitle}
                    </Text>
                </View>
            </TouchableOpacity>
            {index !== 9 && <Divider iosPaddingLeft={50} />}
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    searchRowContainer: {
        flexDirection: 'row',
        paddingVertical: 8,
    },
    searchIconContainer: {
        marginRight: 14,
        width: 40,
        height: 40,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    suggestionTitle: {
        fontWeight: '600',
        fontSize: 16,
    },
    suggestionSubtitle: {
        fontWeight: '400',
        fontSize: 14,
    },
})
export default ResultRow
