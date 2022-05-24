import React, { FC, useCallback, useState, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

import { ICONS, COLORS, VOICE_OPTIONS, ACTION_TIMER, CORRECT_TEXT, ITEM_COUNT, ROW_COUNT, APP_ICON } from './constants';
import { STYLES } from './styles';

export default function App() {
  const totalCount = ROW_COUNT * ITEM_COUNT;
  const rowIndices = useMemo(() => Array.from(Array(ROW_COUNT).keys()), [ROW_COUNT]);
  const colIndices = useMemo(() => Array.from(Array(ITEM_COUNT).keys()), [ROW_COUNT]);

  const [colors, setColors] = useState<string[]>([...COLORS].slice(0, totalCount));
  const [icons, setIcons] = useState<string[]>([...ICONS].slice(0, totalCount));
  const [rightOne, setRightOne] = useState<number>();
  const [isOpen, setIsOpen] = useState<boolean[]>(Array(totalCount).fill(false));
  const [hasOpen, setHasOpen] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [talking, setTalking] = useState<boolean>(false);
  const [correctText, setCorrectText] = useState<string>(CORRECT_TEXT[0]);
  const rightIcon = useMemo(() => icons[rightOne], [icons, rightOne]);

  const closeAll = useCallback(() => {
    setHasOpen(false);
    setIsOpen(Array(totalCount).fill(false));
  }, []);
  const openAll = useCallback(() => {
    setHasOpen(false);
    setIsOpen(Array(totalCount).fill(true));
  }, []);

  const sayIt = useCallback((text: string, timeout = ACTION_TIMER) => {
    if (talking) return;
    setTalking(true);
    Speech.speak(text, VOICE_OPTIONS)
    setTimeout(() => setTalking(false), timeout);
  }, [talking]);

  const clickBox = useCallback((index: number) => {
    if (done && !hasOpen) {
      sayIt(icons[index], 1000);
    }

    if (hasOpen || done || talking) {
      return;
    }

    const newOpen = [...isOpen];
    newOpen[index] = !newOpen[index];
    setIsOpen(newOpen);

    setHasOpen(true);
    if (index === rightOne) {
      setDone(true);
      sayIt(correctText + rightIcon);
      setTimeout(openAll, ACTION_TIMER);
    } else {
      sayIt(icons[index], 1000);
      setTimeout(closeAll, ACTION_TIMER);
    }
  }, [isOpen, hasOpen, closeAll, rightOne, done, talking, openAll, icons, correctText]);

  const sayTheRightOne = useCallback(() => {
    if (rightOne !== undefined) {
      sayIt(icons[rightOne], 1000);
    }
  }, [icons, rightOne, talking]);

  const updateThings = useCallback(() => {
    if (hasOpen || talking) return;

    const colorSet = [...COLORS].sort(() => (Math.random() > .5) ? 1 : -1);
    setColors(colorSet.slice(0, totalCount));

    const iconsSet = [...ICONS].sort(() => (Math.random() > .5) ? 1 : -1);
    const newIcons = iconsSet.slice(0, totalCount);
    setIcons(newIcons);

    const newRightOne = getRandomInt(totalCount);
    setRightOne(newRightOne);

    setDone(false);
    closeAll();

    sayIt("Peek a " + newIcons[newRightOne]);
    setCorrectText(CORRECT_TEXT[getRandomInt(CORRECT_TEXT.length)]);
  }, [closeAll, talking, hasOpen, sayTheRightOne]);

  return (
      <View style={STYLES.container}>
        <View style={STYLES.header}>
          {/*<Text>Testing Header</Text>*/}
        </View>
        <View style={STYLES.north}>
          <Text style={STYLES.title}>
            Peek - A -{' '}
            <TouchableOpacity onPress={sayTheRightOne}>
              <FontAwesome5 name={rightIcon ?? APP_ICON} size={50} color='white' />
            </TouchableOpacity>
          </Text>
          <TouchableOpacity
              onPress={updateThings}
              style={done || !rightIcon ? STYLES.buttonStandOut : STYLES.button}
          >
            <Text>{rightIcon ? 'Mix It Up!' : 'Let\'s Play!'}</Text>
          </TouchableOpacity>
        </View>
        <View style={STYLES.center}>
          {done && (
              <Text style={STYLES.foundIt}>
                {correctText}{rightIcon.replaceAll('-', ' ')}.
              </Text>
          )}
        </View>
        <View style={STYLES.south}>
          <>
            {rightIcon !== undefined && rowIndices.map(rn => {
              return (
                  <View key={rn} style={STYLES.row}>
                    {colIndices.map(cn => {
                      const index = (rn * ITEM_COUNT) + cn;
                      const color = colors[index];
                      const showFade = done && index !== rightOne;
                      return (
                          <View key={index} style={showFade ? STYLES.boxFade : STYLES.box}>
                            <IconBox
                                icon={icons[index]}
                                color={color}
                                index={index}
                                open={isOpen[index]}
                                click={clickBox}
                                size={100}
                            />
                          </View>
                      )
                    })}
                  </View>
              )
            })}
          </>
        </View>
      </View>
  );
}

interface IconBoxProps {
  index: number;
  size: number;
  icon: string;
  color: string;
  open: boolean;
  click: () => void;
}

const IconBox: FC<IconBoxProps> = (props) => {
  const { index, icon, open, size, color, click } = props;

  const onClick = useCallback(() => {
    click(index);
  }, [click, index]);

  return (
      <>
        <FontAwesome5 name={icon} size={size} color={color} style={open ? STYLES.box__icon : STYLES.box__iconHidden} />
        {open && (
            <TouchableOpacity onPress={onClick} style={STYLES.box__boxOpen}>
              <FontAwesome5 name="box-open" size={size} color={color} />
            </TouchableOpacity>
        )}
        {!open && (
            <TouchableOpacity onPress={onClick} style={STYLES.box__boxShut}>
              <FontAwesome5 name="archive" size={size} color={color} />
            </TouchableOpacity>
        )}
      </>
  )
}

IconBox.defaultProps = {
  open: false,
}

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
}
