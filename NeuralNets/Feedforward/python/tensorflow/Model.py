import tensorflow as tf


def create_model(NPL: list[int]) -> tf.keras.models.Sequential:
    model = tf.keras.models.Sequential()

    if not NPL:
        return model

    model.add(
        tf.keras.layers.Dense(
            units=NPL[0], activation="sigmoid", use_bias=True, input_shape=(NPL[0],)
        )
    )

    for layer in range(1, len(NPL)):
        model.add(
            tf.keras.layers.Dense(units=NPL[layer], activation="sigmoid", use_bias=True)
        )

    return model
