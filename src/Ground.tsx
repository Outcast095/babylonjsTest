// Подключаем хук физики для создания физического объекта-плоскости
import { usePlane } from "@react-three/cannon";
// Материал отражающей поверхности + удобный хук загрузки текстур
import { MeshReflectorMaterial, useTexture } from "@react-three/drei";
// Базовые React-хуки
import { useEffect, useRef } from "react";
// Класс для добавления/модификации атрибутов геометрии (например, uv2)
import { BufferAttribute } from "three";
// Импорт пространства имён three для типизации рефов и работы с объектами three
import * as THREE from "three";

// Компонент Ground отвечает за визуальную "землю":
// 1) Полупрозрачная сетка (plane) поверх сцены
// 2) Круглая отражающая поверхность (circle) с параметрами отражений
// 3) Физическая плоскость Cannon, чтобы объекты могли стоять/двигаться по земле
export const Ground = () => {
  // Создаём физическую плоскость. type: 'Static' — не двигается, rotation — лежит горизонтально
  const [ref] = usePlane(
    () => ({ 
      type: 'Static', 
      rotation: [-Math.PI / 2, 0, 0] }
    ), 
    useRef(null)
  );

  // Загружаем текстуры для сетки, карты AO (ambient occlusion) и альфа-карты
  const gridMap = useTexture(process.env.PUBLIC_URL + "/textures/grid.png");

  const aoMap = useTexture(process.env.PUBLIC_URL + "/textures/ground-ao.png");

  const alphaMap = useTexture(process.env.PUBLIC_URL + "/textures/alpha-map.png");

  // Рефы на меши, чтобы работать напрямую с их геометрией (добавить uv2 и т.п.)
  const meshRef = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);

  // Повышаем качество выборки текстуры сетки на современных GPU
  useEffect(() => {
    if (!gridMap) return;

    gridMap.anisotropy = 16;
  }, [gridMap]);

  // Дублируем координаты UV в uv2, чтобы корректно работала карта AO (aoMap)
  // Делается для обеих геометрий: отражающая окружность и плоскость с сеткой
  useEffect(() => {
    if (!meshRef.current) return;
    if (!meshRef2.current) return;

    var uvs = meshRef.current.geometry.attributes.uv.array;
    meshRef.current.geometry.setAttribute("uv2", new BufferAttribute(uvs, 2));

    var uvs2 = meshRef2.current.geometry.attributes.uv.array;
    meshRef2.current.geometry.setAttribute("uv2", new BufferAttribute(uvs2, 2));
  }, []);

  return (
    <>
      {/* Полупрозрачная плоскость с текстурой-сеткой — служит визуальной подсказкой/гридом */}
      <mesh
        ref={meshRef2}
        position={[-2.285, -0.01, -1.325]}
        // Поворачиваем в горизонтальную плоскость
        rotation-x={-Math.PI * 0.5}
      >
        {/* Геометрия плоскости: ширина/высота 12 единиц */}
        <planeGeometry args={[12, 12]} />
        {/* Базовый материал без освещения, чтобы сетка была читаемой */}
        <meshBasicMaterial
          // Небольшая прозрачность, чтобы не доминировала над сценой
          opacity={0.325}
          // Альфа-канал берём из текстуры сетки
          alphaMap={gridMap}
          transparent={true}
          color={"white"}
        />
      </mesh>
      
      {/* Круглая отражающая поверхность — основная "земля" с реалистичными отражениями */}
      <mesh
        ref={meshRef}
        position={[-2.285, -0.015, -1.325]}
        rotation-x={-Math.PI * 0.5}
        // Небольшой наклон по оси Z, чтобы выглядело естественнее
        rotation-z={-0.079}
      >
        {/* Окружность радиуса 6.12 с 50 сегментами */}
        <circleGeometry args={[6.12, 50]} />
        {/* Специализированный материал из drei: делает отражения по "полу" с управляемым блюром */}
        <MeshReflectorMaterial
          // Карта затенения — добавляет глубину и реализм за счёт AO
          aoMap={aoMap}
          // Альфа-карта — определяет прозрачность поверхностей
          alphaMap={alphaMap}
          transparent={true}
          // Базовый цвет отражающей поверхности в линейных значениях (RGB)
          color={[0.5, 0.5, 0.5]}
          // Интенсивность окружения (HDR), влияет на силу отражений
          envMapIntensity={0.35}
          // Металличность и шероховатость — баланс блеска и размытия отражений
          metalness={0.05}
          roughness={0.4}

          dithering={true}
          // Параметры блюра отражений: [ширина, высота]
          blur={[1024, 512]} // Blur ground reflections (width, heigt), 0 skips blur
          // Сколько блюр миксится с шероховатостью поверхности
          mixBlur={3} // How much blur mixes with surface roughness (default = 1)
          // Сила отражений
          mixStrength={30} // Strength of the reflections
          // Контраст отражений
          mixContrast={1} // Contrast of the reflections
          // Разрешение offscreen-буфера: больше — лучше качество и ниже скорость
          resolution={1024} // Off-buffer resolution, lower=faster, higher=better quality, slower
          // Зеркальность: 0 — использовать цвета текстуры, 1 — цвета окружения
          mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
          // Масштаб фактора глубины
          depthScale={0} // Scale the depth factor (0 = no depth, default = 0)
          // Диапазон порогов для интерполяции depthTexture
          minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
          maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
          // Сдвиг отношения глубины к блюру
          depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [bl
          // Смещение виртуальной камеры отражений — помогает убрать артефакты на краях
          reflectorOffset={0.02} // Offsets the virtual camera that projects the reflection. Useful when the reflective
        ></MeshReflectorMaterial>
      </mesh>
    </>
  );
}
